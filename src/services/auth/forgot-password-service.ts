import { randomBytes } from "node:crypto";

import { hash } from "bcrypt-ts";

import { env } from "@/env.js";
import { InvalidCredentials } from "@/errors/user/invalid-credentials-error.js";
import Constants from "@/helpers/constants.js";
import type { IPasswordResetTokenRepository } from "@/interfaces/repositories/password-reset-token-repository.js";
import type { IUserRepository } from "@/interfaces/repositories/user-repository.js";
import { sendResetPasswordMailQueue } from "@/queues/mail-queue.js";

export class ForgotPasswordService {
  private userRepository: IUserRepository;
  private passwordResetTokenRepository: IPasswordResetTokenRepository;

  constructor(
    userRepository: IUserRepository,
    passwordResetTokenRepository: IPasswordResetTokenRepository,
  ) {
    this.userRepository = userRepository;
    this.passwordResetTokenRepository = passwordResetTokenRepository;
  }

  async handle(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

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
          id: user.id,
        },
      },
    });

    const resetPasswordUrl = `${env.APP_URL}/reset-password?token=${rawToken}`;
    const supportEmail = "onboarding@resend.dev";

    await sendResetPasswordMailQueue({
      from: `Enterprise <${supportEmail}>`,
      to: email,
      resetPasswordUrl,
      bucketUrl: env.PUBLIC_BUCKET_URL,
      supportEmail,
      expiresAt: Math.floor(expiresAtTimestamp / 3600),
    });
  }
}
