import { loginSchema } from "@/features/auth/schema/auth.schema";
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

	const accessToken = "fake-access-token";
	const refreshToken = "fake-refresh-token";

	return NextResponse.json({ accessToken, refreshToken, user });
}
