import { clearAuthCookies } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
	await clearAuthCookies();

	return NextResponse.json(
		{ status: "success" },
		{ status: 200 },
	);
}
