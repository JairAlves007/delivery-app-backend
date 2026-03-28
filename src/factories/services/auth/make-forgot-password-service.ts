import { makePasswordResetTokenRepository } from "@/factories/repositories/make-password-reset-token-repository.js";
import { makeUserRepository } from "@/factories/repositories/make-user-repository.js";
import { ForgotPasswordService } from "@/services/auth/forgot-password-service.js";

export const makeForgotPasswordService = () => {
	const userRepository = makeUserRepository();
	const passwordResetTokenRepository = makePasswordResetTokenRepository();

	return new ForgotPasswordService(
		userRepository,
		passwordResetTokenRepository
	);
};
