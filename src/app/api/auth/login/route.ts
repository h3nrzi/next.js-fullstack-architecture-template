import { loginSchema } from "@/features/auth/schema/auth.schema";
import { setAuthCookies, signAccessToken, signRefreshToken } from "@/lib/auth";
import { normalizeZodError } from "@/lib/normalize-zod-error";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(req: Response) {
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

	const { email } = parsed.data;
	const user = { id: "u1", name: "John Doe", email };

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
}
