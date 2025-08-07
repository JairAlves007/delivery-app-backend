import { RoleType, User } from "@prisma/client";

export interface UserWithRoleType extends User {
	roleType: RoleType;
}
