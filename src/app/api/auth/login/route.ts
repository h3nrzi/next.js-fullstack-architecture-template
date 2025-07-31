import { loginSchema } from "@/features/auth/schema/auth.schema";
import {
	setAuthCookies,
	signAccessToken,
	signRefreshToken,
} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Response) {
	const body = await req.json();

	const parsed = loginSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error },
			{ status: 400 },
		);
	}

	const { email } = parsed.data;
	const user = { id: "u1", name: "John Doe", email };

	const accessToken = signAccessToken(user.id);
	const refreshToken = signRefreshToken(user.id);
	setAuthCookies(accessToken, refreshToken);

	return NextResponse.json({
		status: "success",
		data: { user },
	});
}
