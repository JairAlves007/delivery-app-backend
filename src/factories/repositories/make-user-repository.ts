import { UserPrismaRepository } from "@/repositories/user-prisma-repository";

export const makeUserRepository = () => {
	return new UserPrismaRepository();
};
