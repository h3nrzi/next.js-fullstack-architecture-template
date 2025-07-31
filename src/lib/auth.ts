import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET = "access-secret"; // Replace with env later
const REFRESH_TOKEN_SECRET = "refresh-secret"; // Replace with env later

export function signAccessToken(userId: string): string {
	return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});
}

export function signRefreshToken(userId: string): string {
	return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});
}

export async function setAuthCookies(
	accessToken: string,
	refreshToken?: string,
): Promise<void> {
	const cookieStore = await cookies();

	cookieStore.set("accessToken", accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		path: "/",
		maxAge: 60 * 15,
	});

	if (refreshToken) {
		cookieStore.set("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});
	}
}

export async function verifyToken(
	token: string,
	secretKey: string,
): Promise<string | jwt.JwtPayload> {
	return jwt.verify(token, secretKey);
}

export async function clearAuthCookies(): Promise<void> {
	const cookieStore = await cookies();

	cookieStore.set("accessToken", "", { maxAge: 0 });
	cookieStore.set("refreshToken", "", { maxAge: 0 });
}
