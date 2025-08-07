import { UserRepository } from "@/interfaces/user-repository";
import { UserWithRole } from "@/interfaces/user-with-role";
import { prisma } from "@/lib/prisma";
import { Prisma, Role, User } from "@prisma/client";

export class UserPrismaRepository implements UserRepository {
	async findByEmail(email: string): Promise<UserWithRole | null> {
		const user = await prisma.user.findUnique({
			where: { email },
			include: { role: true }
		});

		return user;
	}

	async create(data: Prisma.UserCreateInput): Promise<User> {
		return await prisma.user.create({ data });
	}
}
