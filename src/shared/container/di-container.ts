import { UserModel } from "@/domain/user/entities/user.entity";
import { UserRepository } from "@/domain/user/repositories/user.repository";
import { AuthService } from "@/domain/user/services/auth.service";
import { UserService } from "@/domain/user/services/user.service";

const userRepository = new UserRepository(UserModel);
const authService = new AuthService(userRepository);
const userService = new UserService(userRepository);

export const container = { authService, userService };
