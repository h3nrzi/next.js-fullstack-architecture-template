import { IUser, IUserDoc } from "../domain/user.interface";
import { UserRepository } from "../infra/user.repository";

export class UserService {
	constructor(private readonly userRepo: UserRepository) {}

	async register(user: IUser): Promise<IUserDoc> {
		const existingUser = await this.userRepo.findByEmail(
			user.email,
		);
		if (existingUser) {
			throw new Error("User Already registered!");
		}

		return (await this.userRepo.create(user)).toObject();
	}
}
