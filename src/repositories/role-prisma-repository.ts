import { IRoleRepository } from "@/interfaces/repositories/role-repository";
import { RoleWithPermissions } from "@/interfaces/role";
import { prisma } from "@/lib/prisma";
import { RoleType } from "@prisma/client";

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
