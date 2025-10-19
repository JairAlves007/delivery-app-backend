import type { UserWithRole } from "@/types/user.ts";
import type { PermissionType, Prisma } from "@prisma/client";

export interface IUserRepository {
	findById(id: string): Promise<UserWithRole | null>;

	findByEmail(email: string): Promise<UserWithRole | null>;

	create(data: Prisma.UserCreateInput): Promise<UserWithRole>;

	getPermissions(userId: string): Promise<PermissionType[]>;
}
