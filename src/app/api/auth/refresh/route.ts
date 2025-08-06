import { container, CustomError, NotAuthorizedError } from "@/shared";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
	// Rate limiting store (use Redis in production)
	const refreshAttempts = new Map<string, { count: number; resetTime: number }>();
	const RATE_LIMIT = 5; // Max 5 refresh attempts per hour
	const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

	try {
		// Get client IP
		const refreshToken = (await cookies()).get("refreshToken")?.value;
		const clientIP = (await headers()).get("x-forwarded-for") || "unknown";

		// Check if user has exceeded the rate limit
		const now = Date.now();
		const attempts = refreshAttempts.get(clientIP);
		if (attempts && attempts.count >= RATE_LIMIT && now < attempts.resetTime) {
			throw new NotAuthorizedError("تعداد درخواست‌های شما بیش از حد مجاز است");
		}

		await container.authService.refreshTokens(clientIP, refreshToken);

		// Reset rate limit on successful refresh
		refreshAttempts.delete(clientIP);

		return NextResponse.json(
			{
				status: "success",
				message: "توکن های شما با موفقیت بروزرسانی شدند.",
			},
			{ status: 200 },
		);
	} catch (err) {
		// Track failed attempts
		const clientIP = (await headers()).get("x-forwarded-for") || "unknown";
		const now = Date.now();
		const attempts = refreshAttempts.get(clientIP) || {
			count: 0,
			resetTime: now + RATE_WINDOW,
		};

		// If the rate limit has expired, then reset the attempts
		// If not, increment the attempts
		if (now >= attempts.resetTime) {
			attempts.count = 1;
			attempts.resetTime = now + RATE_WINDOW;
		} else {
			attempts.count++;
		}
		refreshAttempts.set(clientIP, attempts);

		// If the error is a custom error, return the error
		if (err instanceof CustomError) {
			return NextResponse.json(
				{ status: "fail", errors: err.serializeErrors() },
				{ status: err.statusCode },
			);
		}

		// If the error is not a custom error, return a generic error
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
