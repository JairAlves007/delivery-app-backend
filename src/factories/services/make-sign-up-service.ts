import { SignUpService } from "@/services/sign-up-service";
import { makeUserRepository } from "../repositories/make-user-repository";
import { makeRoleRepository } from "../repositories/make-role-repository";

export const makeSignUpService = () => {
	const userRepository = makeUserRepository();
	const roleRepository = makeRoleRepository();
	return new SignUpService(userRepository, roleRepository);
};
