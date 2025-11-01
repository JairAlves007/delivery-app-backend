import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.ts";
import { makeUserRepository } from "@/factories/repositories/make-user-repository.ts";
import { SignInService } from "@/services/auth/sign-in-service.ts";

export const makeSignInService = () => {
	const userRepository = makeUserRepository();
	const establishmentRepository = makeEstablishmentRepository();

	return new SignInService(userRepository, establishmentRepository);
};
