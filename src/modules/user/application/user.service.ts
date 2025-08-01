import { User } from "../domain/user.entity";
import { UserRepository } from "../infrastructure/user.repository";

export class UserService {
	constructor(private readonly userRepo: UserRepository) {}

	async register(name: string, email: string): Promise<User> {
		const existing = await this.userRepo.findByEmail(email);
		if (existing) throw new Error("User already exists");

		const user = new User("", name, email);
		return await this.userRepo.create(user);
	}
}
