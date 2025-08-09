import type { PermissionType, Prisma, Role, User } from "@prisma/client";

interface UserWithRole extends User {
	role: Role;
}

export interface IUserRepository {
	findByEmail(email: string): Promise<UserWithRole | null>;

	create(data: Prisma.UserCreateInput): Promise<User>;

	getPermissions(userId: string): Promise<PermissionType[]>;
}
