import { UserPrismaRepository } from "@/repositories/user-prisma-repository";
import { SignInService } from "@/services/user/sign-in/sign-in-service";

export const makeSignInService = () => {
	const userRepository = new UserPrismaRepository();
	return new SignInService(userRepository);
};
