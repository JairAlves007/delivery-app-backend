import { SignUpService } from "@/services/sign-up-service.ts";
import { makeUserRepository } from "../repositories/make-user-repository.ts";
import { makeRoleRepository } from "../repositories/make-role-repository.ts";

export const makeSignUpService = () => {
	const userRepository = makeUserRepository();
	const roleRepository = makeRoleRepository();
	return new SignUpService(userRepository, roleRepository);
};
