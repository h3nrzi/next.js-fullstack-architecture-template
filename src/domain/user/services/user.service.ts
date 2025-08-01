import { IUserDoc } from "../entities/user.interface";
import { UserRepository } from "../repositories/user.repository";
import { NotFoundError } from "@/shared/errors/not-found-error";

export class UserService {
	constructor(private readonly userRepo: UserRepository) {}

	async getCurrentUser(userId: string): Promise<IUserDoc> {
		const currentUser = await this.userRepo.findById(userId);
		if (!currentUser) {
			throw new NotFoundError("کاربر یافت نشد");
		}

		return currentUser;
	}
}
