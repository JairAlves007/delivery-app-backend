import { makePasswordResetTokenRepository } from "@/factories/repositories/make-password-reset-token-repository.ts";
import { ResetPasswordService } from "@/services/auth/reset-password-service.ts";

export const makeResetPasswordService = () => {
	const passwordResetTokenRepository = makePasswordResetTokenRepository();
	return new ResetPasswordService(passwordResetTokenRepository);
};
