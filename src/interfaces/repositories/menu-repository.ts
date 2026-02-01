import type { RoleType } from "@/generated/prisma/client.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
import type { MenuWithSubmenus } from "@/types/menu.ts";

export interface IMenuRepository {
	get(
		forRole: RoleType,
		establishmentId: EstablishmentID
	): Promise<MenuWithSubmenus[] | null>;

	createForNewEstablishment(establishmentId: EstablishmentID): Promise<void>;
}
