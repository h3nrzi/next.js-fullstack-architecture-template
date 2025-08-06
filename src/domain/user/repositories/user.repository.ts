import { IUser, IUserDoc, IUserModel } from "../entities/user.interface";
import { IRefreshTokenBlacklistModel } from "../entities/refresh-token-blacklist.entity";

export class UserRepository {
	constructor(
		private readonly userModel: IUserModel,
		private readonly refreshTokenBlacklistModel: IRefreshTokenBlacklistModel,
	) {}

	async findByEmail(email: string): Promise<IUserDoc | null> {
		return this.userModel.findOne({ email });
	}

	async findById(id: string): Promise<IUserDoc | null> {
		return this.userModel.findById(id);
	}

	async create(user: IUser): Promise<IUserDoc> {
		return this.userModel.create(user);
	}

	async blacklistRefreshToken(
		jti: string,
		userId: string,
		expiresAt: Date,
	): Promise<void> {
		await this.refreshTokenBlacklistModel.create({ jti, userId, expiresAt });
	}

	async isRefreshTokenBlacklisted(jti: string): Promise<boolean> {
		const blacklistedToken = await this.refreshTokenBlacklistModel.findOne({ jti });
		return !!blacklistedToken;
	}
}
