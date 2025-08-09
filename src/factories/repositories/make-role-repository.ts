import { RolePrismaRepository } from "@/repositories/role-prisma-repository";

export const makeRoleRepository = () => {
	return new RolePrismaRepository();
};
