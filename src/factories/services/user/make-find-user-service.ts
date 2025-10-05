import { makeUserRepository } from "@/factories/repositories/make-user-repository.ts";
import { FindUserService } from "@/services/user/find-user-service.ts";

export const makeFindUserService = () => {
	const userRepository = makeUserRepository();
	return new FindUserService(userRepository);
};
