import type { RoleType } from "@/generated/prisma/client.ts";
import type { IRoleRepository } from "@/interfaces/repositories/role-repository.ts";
import prisma from "@/lib/prisma.ts";
import type { RoleWithPermissions } from "@/types/role.ts";

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
