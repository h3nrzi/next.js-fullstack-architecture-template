import { routeAccess } from "@/constants/route-access";
import { verifyToken } from "@/shared/auth/auth";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { AccessLevel } from "./types/access-level";

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

// Check if pathname starts with any of the given prefixes
function matchesPrefix(pathname: string, prefixes: string[]) {
	return prefixes.some((prefix) => pathname.startsWith(prefix));
}

function getRouteAccessLevel(pathname: string, type: "api" | "page"): AccessLevel | null {
	for (const level of ["public", "protected", "admin"] as AccessLevel[]) {
		if (matchesPrefix(pathname, routeAccess[type][level])) return level;
	}
	return null;
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

	const accessLevel = getRouteAccessLevel(pathname, "api");

	if (accessLevel === "public" || accessLevel === null) {
		return NextResponse.next();
	}

	const token = req.cookies.get("accessToken")?.value;
	if (!token) {
		return NextResponse.json({ error: "Authentication required" }, { status: 401 });
	}

	const secret = process.env.JWT_ACCESS_SECRET;
	if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");

	const payload = (await verifyToken(token, secret)) as { sub: string; role: string };
	if (!payload) {
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}

	if (accessLevel === "admin" && payload.role !== "admin") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const response = NextResponse.next();
	response.headers.set("x-user-id", payload.sub ?? "");
	response.headers.set("x-user-role", payload.role ?? "");

	return response;
}

// Page Auth Logic
async function handlePageAuth(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const pathWithoutLocale = pathname.replace(/^\/(en|fa)/, "") || "/";
	const accessLevel = getRouteAccessLevel(pathWithoutLocale, "page");

	// Public or neutral
	if (accessLevel === "public" || accessLevel === null) {
		return intlMiddleware(req);
	}

	// Require token
	const token = req.cookies.get("accessToken")?.value;
	if (!token) return redirectToLogin(req);

	const secret = process.env.JWT_ACCESS_SECRET;
	if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");

	const payload = (await verifyToken(token, secret)) as { sub: string; role: string };
	if (!payload) return redirectToLogin(req);

	// Check admin role if needed
	if (accessLevel === "admin" && payload.role !== "admin") {
		return redirectToForbidden(req);
	}

	const response = intlMiddleware(req);
	response.headers.set("x-user-id", payload.sub ?? "");
	response.headers.set("x-user-role", payload.role ?? "");

	return response;
}

// Redirection for unauthenticated users
function redirectToLogin(req: NextRequest) {
	const locale = req.nextUrl.pathname.split("/")[1] || "en";
	const loginUrl = new URL(`/${locale}/auth/login`, req.url);
	loginUrl.searchParams.set("redirect", req.nextUrl.pathname + req.nextUrl.search);
	return NextResponse.redirect(loginUrl);
}

// Redirection for forbidden access
function redirectToForbidden(req: NextRequest) {
	const locale = req.nextUrl.pathname.split("/")[1] || "en";
	const url = new URL(`/${locale}/403`, req.url);
	return NextResponse.redirect(url);
}

// Middleware Matcher
export const config = {
	matcher: "/((?!_next|_vercel|.*\\..*).*)",
};
