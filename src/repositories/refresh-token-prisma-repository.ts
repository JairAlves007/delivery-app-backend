import { compare } from "bcrypt-ts";

import type { Prisma,RefreshToken } from "@/generated/prisma/client.js";
import type { IRefreshTokenRepository } from "@/interfaces/repositories/refresh-token-repository.js";
import prisma from "@/lib/prisma.js";

export class RefreshTokenPrismaRepository implements IRefreshTokenRepository {
  async create(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken> {
    return await prisma.refreshToken.create({ data });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const tokens = await prisma.refreshToken.findMany({
      where: {
        revoked_at: null,
        expires_at: { gt: new Date() },
      },
    });

    for (const t of tokens) {
      const tokenIsValid = await compare(token, t.token_hash);

      if (tokenIsValid) {
        return t;
      }
    }

    return null;
  }

  async revoke(id: number): Promise<void> {
    await prisma.refreshToken.update({
      where: { id },
      data: { revoked_at: new Date() },
    });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { user_id: userId, revoked_at: null },
      data: { revoked_at: new Date() },
    });
  }
}