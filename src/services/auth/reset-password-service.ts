import { InvalidToken } from "@/errors/user/password/invalid-token-error.ts";
import type { IPasswordResetTokenRepository } from "@/interfaces/repositories/password-reset-token-repository.ts";
import type { FindByPasswordTokenParams } from "@/types/user.ts";
import { compare } from "bcrypt-ts";

type ResetPasswordServiceParams = FindByPasswordTokenParams & {
	newPassword: string;
};

export class ResetPasswordService {
	private passwordResetTokenRepository: IPasswordResetTokenRepository;

	constructor(passwordResetTokenRepository: IPasswordResetTokenRepository) {
		this.passwordResetTokenRepository = passwordResetTokenRepository;
	}

	async handle({ token, newPassword, userId }: ResetPasswordServiceParams) {
		const passwordResetToken =
			await this.passwordResetTokenRepository.findByToken({
				token,
				userId
			});

		console.log({ passwordResetToken });

		if (!passwordResetToken) throw new InvalidToken();

		const tokenIsValid = await compare(token, passwordResetToken.token_hash);

		if (!tokenIsValid) throw new InvalidToken();

		await this.passwordResetTokenRepository.resetPassword({
			passwordResetTokenId: passwordResetToken.id,
			newPassword,
			userId
		});
	}
}
