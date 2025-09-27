import { makePasswordResetTokenRepository } from "@/factories/repositories/make-password-reset-token-repository.ts";
import { makeUserRepository } from "@/factories/repositories/make-user-repository.ts";
import { ResetPasswordService } from "@/services/auth/reset-password-service.ts";

export const makeResetPasswordService = () => {
	const userRepository = makeUserRepository();
	const passwordResetTokenRepository = makePasswordResetTokenRepository();

	return new ResetPasswordService(userRepository, passwordResetTokenRepository);
};
