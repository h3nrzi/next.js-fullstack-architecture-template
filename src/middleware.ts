import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "login", "register", "/api/auth"];

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (PUBLIC_PATHS.includes(pathname)) {
		return NextResponse.next();
	}

	const token = req.cookies.get("accessToken")?.value;

	const payload = await verifyToken(
		token!,
		process.env.JWT_ACCESS_SECRET!,
	);

	if (!token || !payload) {
		const loginUrl = new URL("/login", req.url);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/profile/:path*"],
};
