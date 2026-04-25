import { PasswordResetTokenPrismaRepository } from "@/repositories/password-reset-token-prisma-repository.js";

export const makePasswordResetTokenRepository = () => {
  return new PasswordResetTokenPrismaRepository();
};
