import { RefreshTokenPrismaRepository } from "@/repositories/refresh-token-prisma-repository.js";

export const makeRefreshTokenRepository = () => {
  return new RefreshTokenPrismaRepository();
};