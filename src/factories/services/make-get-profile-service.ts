import { GetProfileService } from "@/services/get-profile-service";
import { makeUserRepository } from "../repositories/make-user-repository";

export const makeProfileService = () => {
	const userRepository = makeUserRepository();
	return new GetProfileService(userRepository);
};
