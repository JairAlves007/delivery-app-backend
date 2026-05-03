import { makePasswordResetTokenRepository } from "@/factories/repositories/make-password-reset-token-repository.js";
import { ValidateResetPasswordTokenService } from "@/services/auth/validate-reset-password-token-service.js";

export const makeValidateResetPasswordTokenService = () => {
  return new ValidateResetPasswordTokenService(
    makePasswordResetTokenRepository(),
  );
};
