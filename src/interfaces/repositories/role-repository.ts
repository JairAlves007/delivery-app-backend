import { RoleType } from "@prisma/client";
import { RoleWithPermissions } from "../role";

export interface IRoleRepository {
	findByName(name: RoleType): Promise<RoleWithPermissions | null>;
}
