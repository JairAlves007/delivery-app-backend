import { RoleRepository } from "@/interfaces/repositories/role-repository";
import { prisma } from "@/lib/prisma";
import { RoleType, Role } from "@prisma/client";

export class RolePrismaRepository implements RoleRepository {
	findByName(name: RoleType): Promise<Role | null> {
		return prisma.role.findUnique({ where: { name } });
	}
}
