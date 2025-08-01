import { userModel } from "./user.model";
import { User } from "../domain/user.entity";

export class UserRepository {
	async create(user: User): Promise<User> {
		const created = await userModel.create(user);
		return new User(
			created._id.toString(),
			created.name,
			created.email,
		);
	}

	async findByEmail(email: string): Promise<User | null> {
		const found = await userModel.findOne({ email });
		if (!found) return null;
		return new User(
			found._id.toString(),
			found.name,
			found.email,
		);
	}
}
