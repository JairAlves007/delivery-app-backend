import { InvalidCredentials } from "@/errors/user/invalid-credentials-error.ts";
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
		const user = await this.userRepository.findByEmail(email);

		if (!user) throw new InvalidCredentials();

		const rawToken = randomBytes(32).toString("hex");
		const tokenHash = await hash(rawToken, Constants.HASH_SALT_LENGTH);
		const hourInSeconds = 60 * 60;

		await this.passwordResetTokenRepository.create({
			token_hash: tokenHash,
			expires_at: new Date(Date.now() + 1000 * hourInSeconds),
			user: {
				connect: {
					id: user.id
				}
			}
		});

		console.log({ rawToken, tokenHash, userId: user.id });

		// TODO: send email
	}
}
