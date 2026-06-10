import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { MenuAudienceType } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.js";
import type { MenuWithSubmenus } from "@/types/menu.js";

export class GetMenuService {
  private menuRepository: IMenuRepository;

  constructor(menuRepository: IMenuRepository) {
    this.menuRepository = menuRepository;
  }

  async handle(forAudience: MenuAudienceType): Promise<MenuWithSubmenus[] | null> {
    const cache = makeCache();

    return await cache.remember(
      `${cache.keys.menus}_${forAudience.toLowerCase()}`,
      Constants.CACHE_TTL.menus,
      async () => await this.menuRepository.get(forAudience),
      { domain: "menus" },
    );
  }
}
