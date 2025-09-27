import { env } from "@/env.ts";
import { InvalidCredentials } from "@/errors/user/invalid-credentials-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { makeSendResetPasswordMailService } from "@/factories/services/mail/make-send-reset-password-mail-service.ts";
import Constants from "@/helpers/constants.ts";
import type { IPasswordResetTokenRepository } from "@/interfaces/repositories/password-reset-token-repository.ts";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.ts";
import { hash } from "bcrypt-ts";
import { randomBytes } from "node:crypto";

export class ForgotPasswordService {
	private userRepository: IUserRepository;
	private passwordResetTokenRepository: IPasswordResetTokenRepository;

	constructor(
		userRepository: IUserRepository,
		passwordResetTokenRepository: IPasswordResetTokenRepository
	) {
		this.userRepository = userRepository;
		this.passwordResetTokenRepository = passwordResetTokenRepository;
	}

	async handle(email: string): Promise<void> {
		const cache = makeCache();
		const user = await cache.rememberForever(
			`${cache.keys.users}_${email}`,
			async () => await this.userRepository.findByEmail(email)
		);

		if (!user) throw new InvalidCredentials();

		const rawToken = randomBytes(32).toString("hex");
		const tokenHash = await hash(rawToken, Constants.HASH_SALT_LENGTH);
		const expiresAtTimestamp =
			Constants.PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS;

		await this.passwordResetTokenRepository.create({
			token_hash: tokenHash,
			expires_at: new Date(Date.now() + 1000 * expiresAtTimestamp),
			user: {
				connect: {
					id: user.id
				}
			}
		});

		const resetPasswordUrl = `${env.APP_URL}/reset-password?token=${rawToken}&email=${email}`;
		const supportEmail = "onboarding@resend.dev";

		const sendResetPasswordMailService = makeSendResetPasswordMailService();

		await sendResetPasswordMailService.handle({
			from: `Enterprise <${supportEmail}>`,
			to: email,
			resetPasswordUrl,
			bucketUrl: env.PUBLIC_BUCKET_URL,
			supportEmail,
			expiresAt: Math.floor(expiresAtTimestamp / 3600)
		});
	}
}
