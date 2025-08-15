import type { RoleType } from "@prisma/client";
import type { RoleWithPermissions } from "../role.ts";

export interface IRoleRepository {
	findByName(name: RoleType): Promise<RoleWithPermissions | null>;
}
