import type { MenuAudienceType } from "@/generated/prisma/client.js";
import type { MenuWithSubmenus } from "@/types/menu.js";

export interface IMenuRepository {
  get(forAudience: MenuAudienceType): Promise<MenuWithSubmenus[] | null>;

  ensureDefaults(): Promise<void>;
}
