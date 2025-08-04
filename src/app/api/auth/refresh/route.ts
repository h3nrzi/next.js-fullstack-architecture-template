import {
	CustomError,
	NotAuthorizedError,
	setAuthCookies,
	signAccessToken,
	signRefreshToken,
	verifyToken,
} from "@/shared";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		const cookieStore = await cookies();

		const refreshToken = cookieStore.get("refreshToken")?.value;
		if (!refreshToken) {
			throw new NotAuthorizedError("رفرش توکن یافت نشد");
		}

		const payload = (await verifyToken(
			refreshToken,
			process.env.JWT_REFRESH_SECRET!,
		)) as {
			userId: string;
			role: string;
		};
		if (!payload) {
			throw new NotAuthorizedError("رفرش توکن نامعتبر است");
		}

		const newAccessToken = signAccessToken(payload.userId, payload.role);
		const newRefreshToken = signRefreshToken(payload.userId);
		await setAuthCookies(newAccessToken, newRefreshToken);

		return NextResponse.json(
			{
				status: "success",
				message: "توکن های شما با موفقیت بروزرسانی شدند.",
			},
			{ status: 200 },
		);
	} catch (err) {
		if (err instanceof CustomError) {
			return NextResponse.json(
				{ status: "fail", errors: err.serializeErrors() },
				{ status: err.statusCode },
			);
		}

		return NextResponse.json(
			{
				status: "fail",
				errors: [
					{
						field: null,
						message: "سیستم با خطا مواجه شده است. لطفا چند دقیقه دیگر دوباره تلاش کنید.",
					},
				],
			},
			{ status: 500 },
		);
	}
}
