import { SignInService } from "@/services/sign-in-service";
import { makeUserRepository } from "../repositories/make-user-repository";

export const makeSignInService = () => {
	const userRepository = makeUserRepository();

	return new SignInService(userRepository);
};
