import { UserPrismaRepository } from "@/repositories/user-prisma-repository";
import { SignUpService } from "@/services/user/sign-up/sign-up-service";

export const makeSignUpService = () => {
	const userRepository = new UserPrismaRepository();
	return new SignUpService(userRepository);
};
