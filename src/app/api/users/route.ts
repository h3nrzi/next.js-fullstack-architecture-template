import { NextResponse } from "next/server";
import { container } from "@/core/di-container";
import { connectToDatabase } from "@/core/database";

export async function POST(req: Request) {
	await connectToDatabase();

	const body = await req.json();
	const { name, email } = body;

	try {
		const user = await container.userService.register(
			name,
			email,
		);

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
