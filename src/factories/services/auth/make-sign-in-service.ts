import { makeUserRepository } from "@/factories/repositories/make-user-repository.ts";
import { SignInService } from "@/services/auth/sign-in-service.ts";

export const makeSignInService = () => {
	const userRepository = makeUserRepository();

	return new SignInService(userRepository);
};
