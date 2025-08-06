import { LoginInput } from "@/features/users/types/LoginInput";
import { RegisterInput } from "@/features/users/types/RegisterInput";
import { clearAuthCookies, setAuthCookies, signAccessToken, verifyToken } from "@/shared";
import { signRefreshToken } from "@/shared/auth/auth";
import { BadRequestError } from "@/shared/errors/bad-request-error";
import { NotAuthorizedError } from "@/shared/errors/not-authorized-error";
import { NotFoundError } from "@/shared/errors/not-found-error";
import { IUserDoc } from "../entities/user.interface";
import { UserRepository } from "../repositories/user.repository";

export class AuthService {
	constructor(private readonly userRepo: UserRepository) {}

	async register(registerInput: RegisterInput): Promise<IUserDoc> {
		const existingUser = await this.userRepo.findByEmail(registerInput.email);
		if (existingUser) {
			throw new BadRequestError("ایمیل قبلا استفاده شده است");
		}

		return (await this.userRepo.create(registerInput)).toObject();
	}

	async login(loginInput: LoginInput): Promise<IUserDoc> {
		const authenticatedUser = await this.userRepo.findByEmail(loginInput.email);
		if (!authenticatedUser) {
			throw new NotAuthorizedError("ایمیل یا رمز عبور اشتباه است");
		}

		const isPasswordValid = await authenticatedUser.comparePassword(loginInput.password);
		if (!isPasswordValid) {
			throw new NotAuthorizedError("ایمیل یا رمز عبور اشتباه است");
		}

		return authenticatedUser.toObject();
	}

	async blacklistRefreshToken(jti: string, userId: string): Promise<void> {
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
		await this.userRepo.blacklistRefreshToken(jti, userId, expiresAt);
	}

	async refreshTokens(clientIP: string, refreshToken?: string): Promise<void> {
		// If refresh token is not provided, throw an error
		if (!refreshToken) {
			throw new NotAuthorizedError(
				"لطفا رفرش توکن خود را برای تازه کردن اکسس توکن ارسال کنید",
			);
		}

		// If refresh token is invalid, throw an error
		const payload = (await verifyToken(
			refreshToken,
			process.env.JWT_REFRESH_SECRET!,
		)) as { sub: string; role: string; jti?: string };
		if (!payload || !payload.jti) {
			await clearAuthCookies();
			throw new NotAuthorizedError("تاریخ رفرش توکن منقضی شده یا رفرش توکن نامعتبر است");
		}

		// If token is blacklisted, throw an error
		const isBlacklisted = await this.userRepo.isRefreshTokenBlacklisted(payload.jti!);
		if (isBlacklisted) {
			await clearAuthCookies();
			throw new NotAuthorizedError("شما نمی توانید از رفرش توکن های قبلی استفاده کنید");
		}

		// If user still exists and is active, throw an error
		const user = await this.userRepo.findById(payload.sub);
		if (!user) {
			await clearAuthCookies();
			throw new NotFoundError("کاربری ک مرتبط به این رفرش توکن ممکن مسدود شده باشد");
		}

		// Blacklist old refresh token, if not already blacklisted
		await this.blacklistRefreshToken(payload.jti, payload.sub);

		// Generate new tokens with rotation, if not already generated
		const newAccessToken = signAccessToken(payload.sub, user.role);
		const newRefreshToken = signRefreshToken(payload.sub);

		// Set new tokens in cookies
		await setAuthCookies(newAccessToken, newRefreshToken);
	}
}
