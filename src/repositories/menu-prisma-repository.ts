import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
import type { MenuWithSubmenus } from "@/types/menu.ts";
import type { RoleType } from "@prisma/client";

export class MenuPrismaRepository implements IMenuRepository {
	async get(
		forRole: RoleType,
		establishmentId: EstablishmentID
	): Promise<MenuWithSubmenus[] | null> {
		return await prisma.menu.findMany({
			where: {
				for_role: forRole,
				establishment_id: establishmentId
			},
			select: {
				label: true,
				slug: true,
				order: true,
				submenus: {
					select: {
						label: true,
						slug: true,
						order: true
					},
					orderBy: { order: "asc" }
				}
			},
			orderBy: {
				order: "asc"
			}
		});
	}
}
