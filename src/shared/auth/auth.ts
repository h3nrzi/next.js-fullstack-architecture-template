import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { JWTPayload, jwtVerify } from "jose";

export function signAccessToken(userId: string): string {
	return jwt.sign(
		{
			sub: userId,
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
