import { InvalidToken } from "@/errors/user/password/invalid-token-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IPasswordResetTokenRepository } from "@/interfaces/repositories/password-reset-token-repository.ts";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.ts";
import type { FindByPasswordTokenParams } from "@/types/user.ts";
import { compare } from "bcrypt-ts";

type ResetPasswordServiceParams = Omit<FindByPasswordTokenParams, "userId"> & {
	email: string;
	newPassword: string;
};

export class ResetPasswordService {
	private userRepository: IUserRepository;
	private passwordResetTokenRepository: IPasswordResetTokenRepository;

	constructor(
		userRepository: IUserRepository,
		passwordResetTokenRepository: IPasswordResetTokenRepository
	) {
		this.userRepository = userRepository;
		this.passwordResetTokenRepository = passwordResetTokenRepository;
	}

	async handle({ token, newPassword, email }: ResetPasswordServiceParams) {
		const cache = makeCache();
		const key = `${cache.keys.users}_${email}`;

		const user = await cache.rememberForever(
			key,
			async () => await this.userRepository.findByEmail(email)
		);

		if (!user) throw new InvalidToken();

		const userId = user.id;

		const passwordResetToken =
			await this.passwordResetTokenRepository.findByToken({
				token,
				userId
			});

		if (!passwordResetToken) throw new InvalidToken();

		const tokenIsValid = await compare(token, passwordResetToken.token_hash);

		if (!tokenIsValid) throw new InvalidToken();

		await this.passwordResetTokenRepository.resetPassword({
			passwordResetTokenId: passwordResetToken.id,
			newPassword,
			userId
		});

		await cache.forget(key);
	}
}
