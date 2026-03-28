import { makeUserRepository } from "@/factories/repositories/make-user-repository.js";
import { FindUserService } from "@/services/user/find-user-service.js";

export const makeFindUserService = () => {
	const userRepository = makeUserRepository();
	return new FindUserService(userRepository);
};
