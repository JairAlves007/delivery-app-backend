import { RolePrismaRepository } from "@/repositories/role-prisma-repository.ts";

export const makeRoleRepository = () => {
	return new RolePrismaRepository();
};
