import {
	setAuthCookies,
	signAccessToken,
	signRefreshToken,
	verifyToken,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get("refreshToken")?.value;

	if (!refreshToken) {
		return NextResponse.json(
			{
				errors: [
					{
						field: null,
						message: "No refresh token was provided!",
					},
				],
			},
			{ status: 401 },
		);
	}

	const payload = (await verifyToken(
		refreshToken,
		process.env.JWT_REFRESH_SECRET!,
	)) as { userId: string };

	if (!payload)
		return NextResponse.json(
			{
				status: "fail",
				errors: [
					{
						field: null,
						message: "Invalid refresh token",
					},
				],
			},
			{ status: 401 },
		);

	const newAccessToken = signAccessToken(payload.userId);
	const newRefreshToken = signRefreshToken(payload.userId);
	await setAuthCookies(newAccessToken, newRefreshToken);

	return NextResponse.json(
		{ status: "success" },
		{ status: 200 },
	);
}
