import {
	IUser,
	IUserDoc,
	IUserModel,
} from "../domain/user.interface";

export class UserRepository {
	constructor(private readonly userModel: IUserModel) {}

	async create(user: IUser): Promise<IUserDoc> {
		return this.userModel.create(user);
	}

	async findByEmail(email: string): Promise<IUserDoc | null> {
		return this.userModel.findOne({ email });
	}
}
