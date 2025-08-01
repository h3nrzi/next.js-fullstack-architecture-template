import { loginSchema } from "@/features/auth/schema/auth.schema";
import {
	container,
	CustomError,
	RequestValidationError,
	setAuthCookies,
	signAccessToken,
	signRefreshToken,
} from "@/shared";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const parsed = loginSchema.safeParse(body);
		if (!parsed.success) {
			const treeified = z.treeifyError(parsed.error);
			throw new RequestValidationError(treeified);
		}

		const user = await container.userService.login(parsed.data);

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
