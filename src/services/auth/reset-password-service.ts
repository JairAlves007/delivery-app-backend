import { InvalidToken } from "@/errors/user/password/invalid-token-error.js";
import { PasswordDoesNotMatch } from "@/errors/user/password/password-does-not-match-error.js";
import type { IPasswordResetTokenRepository } from "@/interfaces/repositories/password-reset-token-repository.js";

type ResetPasswordServiceParams = {
	token: string;
	newPassword: string;
	confirmPassword: string;
};

export class ResetPasswordService {
	private passwordResetTokenRepository: IPasswordResetTokenRepository;

	constructor(passwordResetTokenRepository: IPasswordResetTokenRepository) {
		this.passwordResetTokenRepository = passwordResetTokenRepository;
	}

	async handle({
		token,
		newPassword,
		confirmPassword
	}: ResetPasswordServiceParams) {
		const passwordResetToken =
			await this.passwordResetTokenRepository.findByToken(token);

		if (!passwordResetToken) throw new InvalidToken();

		if (newPassword !== confirmPassword) throw new PasswordDoesNotMatch();

		await this.passwordResetTokenRepository.resetPassword({
			passwordResetToken,
			newPassword
		});
	}
}
