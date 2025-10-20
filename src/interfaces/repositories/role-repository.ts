import { RoleWithPermissions } from "@/types/role.ts";
import type { RoleType } from "@prisma/client";

export interface IRoleRepository {
	findByName(name: RoleType): Promise<RoleWithPermissions | null>;
}
