import { UserRepository } from "@/interfaces/user-repository";
import { prisma } from "@/lib/prisma";
import { Role, User } from "@prisma/client";

export class UserPrismaRepository implements UserRepository {
	async findByEmail(email: string): Promise<(User & { role: Role }) | null> {
		const user = await prisma.user.findUnique({
			where: { email },
			include: { role: true }
		});

		return user;
	}
}
