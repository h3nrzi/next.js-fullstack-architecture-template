import { registerSchema } from "@/features/auth/schema/auth.schema";
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

	const accessToken = "fake-access-token";
	const refreshToken = "fake-refresh-token";

	return NextResponse.json({ user, accessToken, refreshToken });
}
