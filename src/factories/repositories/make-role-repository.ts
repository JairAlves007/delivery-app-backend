import { RolePrismaRepository } from "@/repositories/role-prisma-repository.js";

export const makeRoleRepository = () => {
	return new RolePrismaRepository();
};
