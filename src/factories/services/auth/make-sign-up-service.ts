import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.ts";
import { makeRoleRepository } from "@/factories/repositories/make-role-repository.ts";
import { makeUserRepository } from "@/factories/repositories/make-user-repository.ts";
import { SignUpService } from "@/services/auth/sign-up-service.ts";

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
