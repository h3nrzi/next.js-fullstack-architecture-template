import { LoginInput, RegisterInput } from "@/features/auth/schema/auth.schema";
import { IUserDoc } from "../domain/user.interface";
import { UserRepository } from "../infra/user.repository";

export class UserService {
	constructor(private readonly userRepo: UserRepository) {}

	async register(registerInput: RegisterInput): Promise<IUserDoc> {
		const existingUser = await this.userRepo.findByEmail(registerInput.email);
		if (existingUser) {
			throw new Error("ایمیل قبلا استفاده شده است");
		}

		return (await this.userRepo.create(registerInput)).toObject();
	}

	async login(loginInput: LoginInput) {
		const authenticatedUser = await this.userRepo.findByEmail(loginInput.email);
		if (!authenticatedUser) {
			throw new Error("ایمیل یا رمز عبور اشتباه است");
		}

		const isPasswordValid = await authenticatedUser.comparePassword(loginInput.password);
		if (!isPasswordValid) {
			throw new Error("ایمیل یا رمز عبور اشتباه است");
		}

		return authenticatedUser.toObject();
	}
}
