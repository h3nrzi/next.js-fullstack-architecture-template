import { z } from "zod";

import { connectToDatabase } from "@/core/database";
import { container } from "@/core/di-container";
import { registerSchema } from "@/features/auth/schema/auth.schema";
import { normalizeZodError } from "@/lib/normalize-zod-error";
import { NextRequest, NextResponse } from "next/server";
import { signAccessToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/auth";
import { signRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
	await connectToDatabase();

	const body = await req.json();

	const parsed = registerSchema.safeParse(body);
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
		const createdUser = await container.userService.register(parsed.data);

		const accessToken = signAccessToken(createdUser.id);
		const refreshToken = signRefreshToken(createdUser.id);
		await setAuthCookies(accessToken, refreshToken);

		return NextResponse.json(
			{
				status: "success",
				data: { user: createdUser },
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
