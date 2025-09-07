import type { Prisma, RoleType, User } from "@prisma/client";

export interface Profile
	extends Omit<User, "password" | "role_id" | "created_at" | "deleted_at"> {
	role: RoleType;
}

export type UserWithRole = Prisma.UserGetPayload<{
	include: { role: true; establishment: true };
}>;
