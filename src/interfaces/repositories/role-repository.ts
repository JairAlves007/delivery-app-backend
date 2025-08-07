import { Role, RoleType } from "@prisma/client";

export interface RoleRepository {
	findByName(name: RoleType): Promise<Role | null>;
}
