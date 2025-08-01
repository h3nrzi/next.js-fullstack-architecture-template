import { UserRepository } from "@/domain/user/repositories/user.repository";
import { UserService } from "@/domain/user/services/user.service";
import { UserModel } from "@/domain/user/entities/user.entity";

const userRepository = new UserRepository(UserModel);
const userService = new UserService(userRepository);

export const container = { userService };
