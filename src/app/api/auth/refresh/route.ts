import {
	setAuthCookies,
	signAccessToken,
	verifyToken,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const REFRESH_TOKEN_SECRET = "refresh-secret"; // Move to env

export async function POST() {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get("refreshToken")?.value;

	if (!refreshToken) {
		return NextResponse.json(
			{ error: "No refresh token was provided!" },
			{ status: 401 },
		);
	}

	try {
		const payload = (await verifyToken(
			refreshToken,
			REFRESH_TOKEN_SECRET,
		)) as { userId: string };

		const newAccessToken = signAccessToken(payload.userId);
		setAuthCookies(newAccessToken, undefined);

		return NextResponse.json(
			{ status: "success" },
			{ status: 200 },
		);
	} catch {
		return NextResponse.json(
			{
				status: "fail",
				errors: [
					{ field: null, message: "Invalid refresh token" },
				],
			},
			{ status: 401 },
		);
	}
}
