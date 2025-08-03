import { container } from "@/shared/container/di-container";
import { NextRequest, NextResponse } from "next/server";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { NotAuthorizedError } from "@/shared/errors/not-authorized-error";

export async function GET(req: NextRequest) {
	try {
		// Get user ID from the header set by middleware
		const userId = req.headers.get("x-user-id");

		if (!userId) {
			throw new NotAuthorizedError("کاربر وارد سیستم نشده است");
		}

		const user = await container.userService.getCurrentUser(userId);

		return NextResponse.json({
			status: "success",
			data: { user },
		});
	} catch (err) {
		if (err instanceof NotAuthorizedError) {
			return NextResponse.json(
				{
					status: "fail",
					errors: [
						{
							field: null,
							message: err.message,
						},
					],
				},
				{ status: 401 },
			);
		}

		if (err instanceof NotFoundError) {
			return NextResponse.json(
				{
					status: "fail",
					errors: [
						{
							field: null,
							message: err.message,
						},
					],
				},
				{ status: 404 },
			);
		}

		if ((err as Error).name === "CastError") {
			return NextResponse.json(
				{
					status: "fail",
					errors: [
						{
							field: null,
							message: "شناسه کاربر معتبر نیست (ObjectId)",
						},
					],
				},
				{ status: 400 },
			);
		}

		console.error("Current user API error:", err);
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
