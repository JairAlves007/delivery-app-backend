import type { UserWithRole } from "@/types/user.ts";
import type { PermissionType, Prisma, User } from "@prisma/client";

export interface IUserRepository {
	findById(id: string): Promise<UserWithRole | null>;

	findByEmail(email: string): Promise<UserWithRole | null>;

	create(data: Prisma.UserCreateInput): Promise<User>;

	getPermissions(userId: string): Promise<PermissionType[]>;
}
