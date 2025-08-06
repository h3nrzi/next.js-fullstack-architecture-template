import mongoose from "mongoose";

export interface IRefreshTokenBlacklist {
	jti: string;
	userId: string;
	expiresAt: Date;
}

export interface IRefreshTokenBlacklistDoc extends mongoose.Document {
	jti: string;
	userId: string;
	expiresAt: Date;
}

export interface IRefreshTokenBlacklistModel
	extends mongoose.Model<IRefreshTokenBlacklistDoc> {}

const refreshTokenBlacklistSchema = new mongoose.Schema<IRefreshTokenBlacklistDoc>(
	{
		jti: {
			type: String,
			required: true,
			unique: true,
		},
		userId: {
			type: String,
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
			expires: 0, // MongoDB TTL - auto delete when expires
		},
	},
	{
		timestamps: true,
	},
);

const RefreshTokenBlacklistModel =
	mongoose.models?.RefreshTokenBlacklist ||
	mongoose.model<IRefreshTokenBlacklistDoc, IRefreshTokenBlacklistModel>(
		"RefreshTokenBlacklist",
		refreshTokenBlacklistSchema,
	);

export { RefreshTokenBlacklistModel };
