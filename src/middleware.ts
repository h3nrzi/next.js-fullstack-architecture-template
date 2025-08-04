import { verifyToken } from "@/shared/auth/auth";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

// Constants
const PUBLIC_API_PREFIXES = ["/api/auth"];
const PROTECTED_API_PREFIXES = ["/api/users"];
const PUBLIC_PAGE_PREFIXES = ["/auth/login", "/auth/register"];
const PROTECTED_PAGE_PREFIXES = ["/dashboard", "/profile"];

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

// Check if pathname starts with any of the given prefixes
function matchesPrefix(pathname: string, prefixes: string[]) {
	return prefixes.some((prefix) => pathname.startsWith(prefix));
}

// Middleware entry point
export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Handle API routes (no i18n)
	if (pathname.startsWith("/api")) {
		return await handleApiAuth(req);
	}

	// Handle page routes (i18n-aware)
	return await handlePageAuth(req);
}

// API Auth Logic
async function handleApiAuth(req: NextRequest) {
	const { pathname } = req.nextUrl;

	const isPublic = matchesPrefix(pathname, PUBLIC_API_PREFIXES);
	const isProtected = matchesPrefix(pathname, PROTECTED_API_PREFIXES);

	// Public API route: allow without token
	if (isPublic) {
		return NextResponse.next();
	}

	// Neutral API route: not explicitly public or protected
	if (!isProtected) {
		return NextResponse.next();
	}

	// Protected API route: require valid token
	const token = req.cookies.get("accessToken")?.value;
	if (!token) {
		return NextResponse.json({ error: "Authentication required" }, { status: 401 });
	}

	const secret = process.env.JWT_ACCESS_SECRET;
	if (!secret) {
		throw new Error("JWT_ACCESS_SECRET is not set");
	}

	const payload = await verifyToken(token, secret);
	if (!payload) {
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}

	const response = NextResponse.next();
	response.headers.set("x-user-id", payload.sub ?? "");

	return response;
}

// Page Auth Logic
async function handlePageAuth(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const pathWithoutLocale = pathname.replace(/^\/(en|fa)/, "") || "/";

	// Public page: skip auth, just apply i18n
	if (matchesPrefix(pathWithoutLocale, PUBLIC_PAGE_PREFIXES)) {
		return intlMiddleware(req);
	}

	// Protected page: require token
	if (matchesPrefix(pathWithoutLocale, PROTECTED_PAGE_PREFIXES)) {
		const token = req.cookies.get("accessToken")?.value;
		if (!token) return redirectToLogin(req);

		const secret = process.env.JWT_ACCESS_SECRET;
		if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");

		const payload = await verifyToken(token, secret);
		if (!payload) return redirectToLogin(req);

		const response = intlMiddleware(req);
		response.headers.set("x-user-id", payload.sub ?? "");
		return response;
	}

	// Neutral route: not public or protected
	return intlMiddleware(req);
}

// Redirection for unauthenticated users
function redirectToLogin(req: NextRequest) {
	const locale = req.nextUrl.pathname.split("/")[1] || "en";
	const loginUrl = new URL(`/${locale}/auth/login`, req.url);
	loginUrl.searchParams.set("redirect", req.nextUrl.pathname + req.nextUrl.search);
	return NextResponse.redirect(loginUrl);
}

// Middleware Matcher
export const config = {
	matcher: "/((?!_next|_vercel|.*\\..*).*)",
};
