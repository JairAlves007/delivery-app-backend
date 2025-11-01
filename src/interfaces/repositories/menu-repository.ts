import type { EstablishmentID } from "@/types/establishment.ts";
import type { MenuWithSubmenus } from "@/types/menu.ts";
import type { RoleType } from "@prisma/client";

export interface IMenuRepository {
	get(
		forRole: RoleType,
		establishmentId: EstablishmentID
	): Promise<MenuWithSubmenus[] | null>;

	createForNewEstablishment(establishmentId: EstablishmentID): Promise<void>;
}
