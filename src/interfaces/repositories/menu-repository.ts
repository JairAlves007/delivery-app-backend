import type { RoleType } from "@/generated/prisma/client.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { MenuWithSubmenus } from "@/types/menu.js";

export interface IMenuRepository {
  get(
    forRole: RoleType,
    establishmentId: EstablishmentID,
  ): Promise<MenuWithSubmenus[] | null>;

  createForNewEstablishment(establishmentId: EstablishmentID): Promise<void>;
}
