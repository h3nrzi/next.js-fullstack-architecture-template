import { registerSchema } from "@/features/auth/schema/auth.schema";
import {
	setAuthCookies,
	signAccessToken,
	signRefreshToken,
} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Response) {
	const body = await req.json();

	const parsed = registerSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error },
			{ status: 400 },
		);
	}

	const { name, email } = parsed.data;
	const user = { id: "u1", name, email };

	const accessToken = signAccessToken(user.id);
	const refreshToken = signRefreshToken(user.id);
	setAuthCookies(accessToken, refreshToken);

	return NextResponse.json({
		status: "success",
		data: { user },
	});
}
