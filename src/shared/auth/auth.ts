import { JWTPayload, jwtVerify } from "jose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function signAccessToken(userId: string, role: string): string {
	return jwt.sign(
		{
			sub: userId,
			role,
		},
		process.env.JWT_ACCESS_SECRET!,
		{
			expiresIn: "15m",
		},
	);
}

export function signRefreshToken(userId: string): string {
	return jwt.sign(
		{
			sub: userId,
		},
		process.env.JWT_REFRESH_SECRET!,
		{
			expiresIn: "7d",
		},
	);
}

export async function setAuthCookies(
	accessToken: string,
	refreshToken?: string,
): Promise<void> {
	const cookieStore = await cookies();

	cookieStore.set("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "strict",
		path: "/",
		maxAge: 60 * 15,
	});

	if (refreshToken) {
		cookieStore.set("refreshToken", refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});
	}
}

export async function verifyToken(
	token: string,
	secretKey: string,
): Promise<JWTPayload | null> {
	const key = new TextEncoder().encode(secretKey);

	try {
		const { payload } = await jwtVerify(token, key);
		return payload;
	} catch {
		return null;
	}
}

export async function clearAuthCookies(): Promise<void> {
	const cookieStore = await cookies();

	cookieStore.set("accessToken", "", { maxAge: 0 });
	cookieStore.set("refreshToken", "", { maxAge: 0 });
}

export async function getUserFromRequest(): Promise<{ id: string; role: string } | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get("accessToken")?.value;
	if (!token) return null;

	const secret = process.env.JWT_ACCESS_SECRET;
	if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");

	const payload = (await verifyToken(token, secret)) as { sub: string; role: string };
	if (!payload) return null;

	return {
		id: payload.sub,
		role: payload.role,
	};
}
