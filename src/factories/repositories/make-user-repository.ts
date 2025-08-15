import { UserPrismaRepository } from "@/repositories/user-prisma-repository.ts";

export const makeUserRepository = () => {
	return new UserPrismaRepository();
};
