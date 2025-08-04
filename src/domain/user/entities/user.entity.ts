import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { IUserDoc, IUserModel } from "./user.interface";

const userSchema = new mongoose.Schema<IUserDoc>(
	{
		name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
	},
	{
		toJSON: {
			transform(doc, ret: any) {
				ret.id = ret._id.toString();
				delete ret._id;
				delete ret.__v;
				delete ret.password;
				return ret;
			},
		},
		toObject: {
			transform(doc, ret: any) {
				ret.id = ret._id.toString();
				delete ret._id;
				delete ret.__v;
				delete ret.password;
				return ret;
			},
		},
	},
);

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);

	next();
});

// Compare password
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

// Create model if it doesn't exist
const UserModel =
	mongoose.models?.User || mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { UserModel };
