import type { Prisma, RefreshToken } from "@/generated/prisma/client.js";
import type { UserID } from "@/types/user.js";

export interface IRefreshTokenRepository {
	create(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken>;
	findValidById(id: number): Promise<RefreshToken | null>;
	revoke(id: number): Promise<void>;
	revokeAllByUserId(userId: UserID): Promise<void>;
}
