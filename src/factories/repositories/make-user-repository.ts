import { UserPrismaRepository } from "@/repositories/user-prisma-repository.js";

export const makeUserRepository = () => {
	return new UserPrismaRepository();
};
