import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { RoleType } from "@/generated/prisma/client.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { MenuWithSubmenus } from "@/types/menu.js";

export class GetMenuService {
  private menuRepository: IMenuRepository;

  constructor(menuRepository: IMenuRepository) {
    this.menuRepository = menuRepository;
  }

  async handle(
    forRole: RoleType,
    establishmentId: EstablishmentID,
  ): Promise<MenuWithSubmenus[] | null> {
    const cache = makeCache();
    const prefixKey = getFilterParamsCacheKey({
      establishment_id: establishmentId,
    });

    return await cache.rememberForever(
      `${prefixKey}${cache.keys.menus}_${forRole.toLowerCase()}`,
      async () => await this.menuRepository.get(forRole, establishmentId),
    );
  }
}
