import { verifyToken } from "@/shared";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

const PUBLIC_API_PATHS = new Set(["/api/auth"]);
const PROTECTED_API_PATHS = ["/api/users"];
const PUBLIC_PAGE_PATHS = new Set([
	"/login",
	"/register",
	"/auth/login",
	"/auth/register",
]);
const PROTECTED_PAGE_PATHS = ["/dashboard", "/profile"];

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Handle API routes separately (no i18n needed)
	if (pathname.startsWith("/api")) {
		return await handleApiAuth(req);
	}

	// Handle page routes with i18n
	return await handlePageAuth(req);
}

async function handleApiAuth(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Check if the API path is public
	const isPublicApiPath = Array.from(PUBLIC_API_PATHS).some((path) =>
		pathname.startsWith(path),
	);
	if (isPublicApiPath) return NextResponse.next();

	// Check if the API path requires authentication
	const isProtectedApiPath = PROTECTED_API_PATHS.some((path) =>
		pathname.startsWith(path),
	);
	if (!isProtectedApiPath) return NextResponse.next();

	// Check if the token is provided
	const token = req.cookies.get("accessToken")?.value;
	if (!token) {
		return NextResponse.json({ error: "Authentication required" }, { status: 401 });
	}

	// Verify token
	const payload = await verifyToken(token, process.env.JWT_ACCESS_SECRET ?? "");
	if (!payload) {
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}

	// Add user info to headers for downstream use
	const response = NextResponse.next();
	response.headers.set("x-user-id", payload.sub ?? "");

	return response;
}

async function handlePageAuth(req: NextRequest) {
	// Handle internationalization first
	const response = intlMiddleware(req);

	const { pathname } = req.nextUrl;

	// Remove locale from path for auth logic
	const pathWithoutLocale = pathname.replace(/^\/(en|fa)/, "") || "/";

	// Check if the page path is public
	const isPublicPagePath = Array.from(PUBLIC_PAGE_PATHS).some((path) =>
		pathWithoutLocale.startsWith(path),
	);
	if (isPublicPagePath) return response;

	// Check if the page path requires authentication
	const isProtectedPagePath = PROTECTED_PAGE_PATHS.some((path) =>
		pathWithoutLocale.startsWith(path),
	);
	if (!isProtectedPagePath) return response;

	// Check if the token is provided
	const token = req.cookies.get("accessToken")?.value;
	if (!token) return redirectToLogin(req);

	// Verify token
	const payload = await verifyToken(token, process.env.JWT_ACCESS_SECRET ?? "");
	if (!payload) return redirectToLogin(req);

	// Create new response with user info headers
	const newResponse = NextResponse.next();
	newResponse.headers.set("x-user-id", payload.sub ?? "");

	return newResponse;
}

function redirectToLogin(req: NextRequest) {
	const locale = req.nextUrl.pathname.split("/")[1] || "en";
	const loginUrl = new URL(`/${locale}/auth/login`, req.url);

	loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
	return NextResponse.redirect(loginUrl);
}

// Configuration for matcher
export const config = {
	// Match all pathnames except for
	// - … if they start with `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	// Note: We include API routes for authentication
	matcher: "/((?!_next|_vercel|.*\\..*).*)",
};
