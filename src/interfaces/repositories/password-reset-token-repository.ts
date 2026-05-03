import type { PasswordResetToken, Prisma } from "@/generated/prisma/client.js";
import type { ResetPasswordParams } from "@/types/user.js";

export interface IPasswordResetTokenRepository {
  create(
    data: Prisma.PasswordResetTokenCreateInput,
  ): Promise<PasswordResetToken>;
  findByToken(token: string): Promise<PasswordResetToken | null>;
  invalidatePreviousByUserId(userId: string): Promise<void>;
  resetPassword(params: ResetPasswordParams): Promise<void>;
}
