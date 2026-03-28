import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { makeUserRepository } from "@/factories/repositories/make-user-repository.js";
import { SignInService } from "@/services/auth/sign-in-service.js";

export const makeSignInService = () => {
	const userRepository = makeUserRepository();
	const establishmentRepository = makeEstablishmentRepository();

	return new SignInService(userRepository, establishmentRepository);
};
