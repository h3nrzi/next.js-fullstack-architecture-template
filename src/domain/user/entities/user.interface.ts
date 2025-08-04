import mongoose from "mongoose";

export interface IUser {
	name: string;
	email: string;
	password: string;
}

export interface IUserDoc extends mongoose.Document {
	id: string;
	name: string;
	email: string;
	password: string;
	role: string;
	comparePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends mongoose.Model<IUserDoc> {
	// build: (user: IUser) => IUserDoc;
}
