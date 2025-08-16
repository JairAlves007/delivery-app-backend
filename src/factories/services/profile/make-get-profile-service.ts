import { makeUserRepository } from "@/factories/repositories/make-user-repository.ts";
import { GetProfileService } from "@/services/profile/get-profile-service.ts";

export const makeProfileService = () => {
	const userRepository = makeUserRepository();
	return new GetProfileService(userRepository);
};
