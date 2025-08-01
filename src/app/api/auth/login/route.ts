import z from "zod";

import { container } from "@/core/di-container";
import { loginSchema } from "@/features/auth/schema/auth.schema";
import { setAuthCookies, signAccessToken, signRefreshToken } from "@/lib/auth";
import { normalizeZodError } from "@/lib/normalize-zod-error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();

	const parsed = loginSchema.safeParse(body);
	if (!parsed.success) {
		const treeified = z.treeifyError(parsed.error);
		const { errors } = normalizeZodError(treeified);

		return NextResponse.json(
			{
				status: "fail",
				errors,
			},
			{ status: 400 },
		);
	}

	try {
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
		return NextResponse.json(
			{
				status: "fail",
				error: (err as Error).message,
			},
			{ status: 400 },
		);
	}
}
