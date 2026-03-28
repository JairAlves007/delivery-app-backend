import type { RoleType } from "@/generated/prisma/client.js";
import { RoleWithPermissions } from "@/types/role.js";

export interface IRoleRepository {
	findByName(name: RoleType): Promise<RoleWithPermissions | null>;
}
