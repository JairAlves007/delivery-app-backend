import type { Role, RoleType, User } from "@prisma/client";

export interface Profile
	extends Omit<User, "password" | "role_id" | "created_at" | "deleted_at"> {
	role: RoleType;
}

export interface UserWithRole extends User {
	role: Role;
}
