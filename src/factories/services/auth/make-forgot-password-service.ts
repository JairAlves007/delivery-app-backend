import { makePasswordResetTokenRepository } from "@/factories/repositories/make-password-reset-token-repository.ts";
import { makeUserRepository } from "@/factories/repositories/make-user-repository.ts";
import { ForgotPasswordService } from "@/services/auth/forgot-password-service.ts";

export const makeForgotPasswordService = () => {
	const userRepository = makeUserRepository();
	const passwordResetTokenRepository = makePasswordResetTokenRepository();

	return new ForgotPasswordService(
		userRepository,
		passwordResetTokenRepository
	);
};
