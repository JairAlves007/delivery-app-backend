import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { makeRoleRepository } from "@/factories/repositories/make-role-repository.js";
import { makeUserRepository } from "@/factories/repositories/make-user-repository.js";
import { SignUpService } from "@/services/auth/sign-up-service.js";

export const makeSignUpService = () => {
	const userRepository = makeUserRepository();
	const roleRepository = makeRoleRepository();
	const establishmentRepository = makeEstablishmentRepository();

	return new SignUpService(
		userRepository,
		roleRepository,
		establishmentRepository
	);
};
