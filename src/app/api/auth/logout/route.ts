import { clearAuthCookies } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		await clearAuthCookies();

		return NextResponse.json(
			{
				status: "success",
				message: "شما با موفقیت از حساب خود خارج شدید.",
			},
			{ status: 200 },
		);
	} catch {
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
