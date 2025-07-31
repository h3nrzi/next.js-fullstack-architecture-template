import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Public paths as a Set for O(1) lookup
const PUBLIC_PATHS = new Set([
	"/login",
	"/register",
	"/api/auth",
]);

// Protected paths
const PROTECTED_PATHS = ["/dashboard", "/profile"];

// Configuration for matcher
export const config = {
	matcher: [
		"/dashboard/:path*",
		"/profile/:path*",
		"/api/:path*",
	],
};

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Check if the path is public
	const isPublicPath = Array.from(PUBLIC_PATHS).some((path) =>
		pathname.startsWith(path),
	);
	if (isPublicPath) return NextResponse.next();

	// Check if the path requires authentication
	const isProtectedPath = PROTECTED_PATHS.some((path) =>
		pathname.startsWith(path),
	);
	if (!isProtectedPath) return NextResponse.next();

	// Check if the token is provided
	const token = req.cookies.get("accessToken")?.value;
	if (!token) return redirectToLogin(req);

	// Verify token with type safety
	const payload = await verifyToken(
		token,
		process.env.JWT_ACCESS_SECRET ?? "",
	);
	if (!payload) return redirectToLogin(req);

	// User info to headers for downstream use
	const response = NextResponse.next();
	response.headers.set("x-user-id", payload.sub ?? "");

	return response;
}

function redirectToLogin(req: NextRequest) {
	const loginUrl = new URL("/login", req.url);

	loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
	return NextResponse.redirect(loginUrl);
}
