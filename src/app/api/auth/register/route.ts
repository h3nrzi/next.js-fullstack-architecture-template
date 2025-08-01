import { z } from "zod";

import { connectToDatabase } from "@/core/database";
import { container } from "@/core/di-container";
import { registerSchema } from "@/features/auth/schema/auth.schema";
import { setAuthCookies, signAccessToken, signRefreshToken } from "@/lib/auth";
import { CustomError } from "@/lib/errors/custom-error";
import { RequestValidationError } from "@/lib/errors/request-validation-error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();

		const body = await req.json();

		const parsed = registerSchema.safeParse(body);
		if (!parsed.success) {
			const treeified = z.treeifyError(parsed.error);
			throw new RequestValidationError(treeified);
		}

		const user = await container.userService.register(parsed.data);

		const accessToken = signAccessToken(user.id);
		const refreshToken = signRefreshToken(user.id);
		await setAuthCookies(accessToken, refreshToken);

		return NextResponse.json(
			{
				status: "success",
				data: { user },
			},
			{ status: 200 },
		);
	} catch (err) {
		if (err instanceof CustomError) {
			return NextResponse.json(
				{
					status: "fail",
					errors: err.serializeErrors(),
				},
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
