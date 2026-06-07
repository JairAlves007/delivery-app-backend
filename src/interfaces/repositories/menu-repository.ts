import type { MenuAudienceType, ViewType } from "@/generated/prisma/client.js";
import type { MenuWithSubmenus } from "@/types/menu.js";

export type FindMenuSlugByViewTypeParams = {
  viewType: ViewType;
  forAudience: MenuAudienceType;
};

export interface IMenuRepository {
  get(forAudience: MenuAudienceType): Promise<MenuWithSubmenus[] | null>;

  findSlugByViewType(
    params: FindMenuSlugByViewTypeParams,
  ): Promise<string | null>;

  ensureDefaults(): Promise<void>;
}
