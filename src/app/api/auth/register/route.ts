import { registerSchema } from "@/features/auth/schema/auth.schema";
import {
	connectToDatabase,
	container,
	CustomError,
	RequestValidationError,
	setAuthCookies,
	signAccessToken,
	signRefreshToken,
} from "@/shared";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();

		const body = await req.json();

		const parsed = registerSchema.safeParse(body);
		if (!parsed.success) {
			const treeified = z.treeifyError(parsed.error);
			throw new RequestValidationError(treeified);
		}

		const user = await container.authService.register(parsed.data);

		const accessToken = signAccessToken(user.id, user.role);
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

		console.error(err);
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
