import type { IPasswordResetTokenRepository } from "@/interfaces/repositories/password-reset-token-repository.js";

export class ValidateResetPasswordTokenService {
  private passwordResetTokenRepository: IPasswordResetTokenRepository;

  constructor(passwordResetTokenRepository: IPasswordResetTokenRepository) {
    this.passwordResetTokenRepository = passwordResetTokenRepository;
  }

  async handle(token: string): Promise<{ valid: boolean }> {
    const passwordResetToken =
      await this.passwordResetTokenRepository.findByToken(token);

    return { valid: passwordResetToken !== null };
  }
}
