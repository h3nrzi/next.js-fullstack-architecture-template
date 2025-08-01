import { UserRepository } from "@/modules/user/infrastructure/user.repository";
import { UserService } from "@/modules/user/application/user.service";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const container = { userService };
