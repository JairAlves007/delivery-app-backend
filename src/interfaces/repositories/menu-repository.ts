import type { MenuWithSubmenus } from "@/types/menu.ts";
import type { RoleType } from "@prisma/client";

export interface IMenuRepository {
	get(
		forRole: RoleType,
		establishmentId: string
	): Promise<MenuWithSubmenus[] | null>;
}
