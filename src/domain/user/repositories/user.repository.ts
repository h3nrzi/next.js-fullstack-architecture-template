import { IUser, IUserDoc, IUserModel } from "../entities/user.interface";

export class UserRepository {
	constructor(private readonly userModel: IUserModel) {}

	async findByEmail(email: string): Promise<IUserDoc | null> {
		return this.userModel.findOne({ email });
	}

	async findById(id: string): Promise<IUserDoc | null> {
		return this.userModel.findById(id);
	}

	async create(user: IUser): Promise<IUserDoc> {
		return this.userModel.create(user);
	}
}
