import { makePasswordResetTokenRepository } from "@/factories/repositories/make-password-reset-token-repository.js";
import { ResetPasswordService } from "@/services/auth/reset-password-service.js";

export const makeResetPasswordService = () => {
  const passwordResetTokenRepository = makePasswordResetTokenRepository();

  return new ResetPasswordService(passwordResetTokenRepository);
};
