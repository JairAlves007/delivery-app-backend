import { GetProfileService } from "@/services/get-profile-service.ts";
import { makeUserRepository } from "../repositories/make-user-repository.ts";

export const makeProfileService = () => {
	const userRepository = makeUserRepository();
	return new GetProfileService(userRepository);
};
