import { UserRepository } from "@/modules/user/infra/user.repository";
import { UserService } from "@/modules/user/application/user.service";
import { UserModel } from "@/modules/user/domain/user.entity";

const userRepository = new UserRepository(UserModel);
const userService = new UserService(userRepository);

export const container = { userService };
