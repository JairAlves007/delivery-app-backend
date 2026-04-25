import type { RoleType } from "@/generated/prisma/client.js";
import type { MenuWithSubmenus } from "@/types/menu.js";

export interface IMenuRepository {
  get(forRole: RoleType): Promise<MenuWithSubmenus[] | null>;

  ensureDefaults(): Promise<void>;
}
