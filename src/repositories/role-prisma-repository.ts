import type { IRoleRepository } from "@/interfaces/repositories/role-repository.ts";
import type { RoleWithPermissions } from "@/types/role.ts";
import { prisma } from "@/lib/prisma.ts";
import type { RoleType } from "@prisma/client";

export class RolePrismaRepository implements IRoleRepository {
	async findByName(name: RoleType): Promise<RoleWithPermissions | null> {
		return await prisma.role.findUnique({
			where: {
				name
			},
			include: {
				permissions: {
					select: {
						permission: {
							select: {
								name: true
							}
						}
					}
				}
			}
		});
	}
}
