import { Role, RoleType, User } from "@prisma/client";

export interface UserWithRoleType extends User {
	roleType: RoleType;
}

export interface UserWithRole extends User {
	role: Role;
}
