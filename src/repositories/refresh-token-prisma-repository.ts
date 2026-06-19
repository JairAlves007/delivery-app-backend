import type { Prisma, RefreshToken } from "@/generated/prisma/client.js";
import type { IRefreshTokenRepository } from "@/interfaces/repositories/refresh-token-repository.js";
import prisma from "@/lib/prisma.js";
import type { UserID } from "@/types/user.js";

export class RefreshTokenPrismaRepository implements IRefreshTokenRepository {
	async create(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken> {
		return await prisma.refreshToken.create({ data });
	}

	async findValidById(id: number): Promise<RefreshToken | null> {
		return await prisma.refreshToken.findFirst({
			where: {
				id,
				revoked_at: null,
				expires_at: { gt: new Date() }
			}
		});
	}

	async revoke(id: number): Promise<void> {
		await prisma.refreshToken.update({
			where: { id },
			data: { revoked_at: new Date() }
		});
	}

	async revokeAllByUserId(userId: UserID): Promise<void> {
		await prisma.refreshToken.updateMany({
			where: { user_id: userId, revoked_at: null },
			data: { revoked_at: new Date() }
		});
	}
}
