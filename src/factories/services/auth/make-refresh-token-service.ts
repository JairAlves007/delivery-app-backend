import { makeRefreshTokenRepository } from "@/factories/repositories/make-refresh-token-repository.js";
import { RefreshTokenService } from "@/services/auth/refresh-token-service.js";

export const makeRefreshTokenService = () => {
  const refreshTokenRepository = makeRefreshTokenRepository();

  return new RefreshTokenService(refreshTokenRepository);
};