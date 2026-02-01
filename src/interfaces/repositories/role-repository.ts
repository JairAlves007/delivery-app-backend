import type { RoleType } from "@/generated/prisma/client.ts";
import { RoleWithPermissions } from "@/types/role.ts";

export interface IRoleRepository {
	findByName(name: RoleType): Promise<RoleWithPermissions | null>;
}
