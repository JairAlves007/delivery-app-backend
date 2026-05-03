import { randomBytes } from "node:crypto";

import { hash } from "bcrypt-ts";

import { env } from "@/env.js";
import Constants from "@/helpers/constants.js";
import { computeLookupHash } from "@/helpers/token.js";
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

    if (!user) return;

    await this.passwordResetTokenRepository.invalidatePreviousByUserId(user.id);

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = await hash(rawToken, Constants.HASH_SALT_LENGTH);
    const lookupHash = computeLookupHash(rawToken);
    const expiresInSeconds =
      Constants.PASSWORD_RESET_TOKEN_EXPIRES_IN_SECONDS;

    await this.passwordResetTokenRepository.create({
      token_hash: tokenHash,
      lookup_hash: lookupHash,
      expires_at: new Date(Date.now() + 1000 * expiresInSeconds),
      user: { connect: { id: user.id } },
    });

    const resetPasswordUrl = `${env.APP_URL}/reset-password?token=${rawToken}`;
    const expiresInHours = Math.max(1, Math.round(expiresInSeconds / 3600));

    await sendResetPasswordMailQueue({
      from: env.MAIL_FROM,
      to: user.email,
      resetPasswordUrl,
      bucketUrl: env.PUBLIC_BUCKET_URL,
      supportEmail: env.SUPPORT_EMAIL,
      expiresAt: expiresInHours,
    });
  }
}
