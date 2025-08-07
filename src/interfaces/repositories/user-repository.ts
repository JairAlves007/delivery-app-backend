import type { Prisma, Role, User } from "@prisma/client";

interface UserWithRole extends User {
	role: Role;
}

export interface UserRepository {
	findByEmail(email: string): Promise<UserWithRole | null>;

	create(data: Prisma.UserCreateInput): Promise<User>;
}
