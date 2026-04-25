import { compare } from "bcrypt-ts";

import { InvalidToken } from "@/errors/user/password/invalid-token-error.js";
import type { IPasswordResetTokenRepository } from "@/interfaces/repositories/password-reset-token-repository.js";

type ResetPasswordServiceParams = {
  token: string;
  newPassword: string;
};

export class ResetPasswordService {
  private passwordResetTokenRepository: IPasswordResetTokenRepository;

  constructor(passwordResetTokenRepository: IPasswordResetTokenRepository) {
    this.passwordResetTokenRepository = passwordResetTokenRepository;
  }

  async handle({ token, newPassword }: ResetPasswordServiceParams) {
    const passwordResetToken =
      await this.passwordResetTokenRepository.findByToken(token);

    if (!passwordResetToken) throw new InvalidToken();

    const tokenIsValid = await compare(token, passwordResetToken.token_hash);

    if (!tokenIsValid) throw new InvalidToken();

    await this.passwordResetTokenRepository.resetPassword({
      passwordResetToken,
      newPassword,
    });
  }
}
