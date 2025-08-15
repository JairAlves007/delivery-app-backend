import { SignInService } from "@/services/sign-in-service.ts";
import { makeUserRepository } from "../repositories/make-user-repository.ts";

export const makeSignInService = () => {
	const userRepository = makeUserRepository();

	return new SignInService(userRepository);
};
