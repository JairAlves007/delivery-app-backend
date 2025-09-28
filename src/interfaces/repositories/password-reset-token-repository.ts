import type { ResetPasswordParams } from "@/types/user.ts";
import type { PasswordResetToken, Prisma } from "@prisma/client";

export interface IPasswordResetTokenRepository {
	create(
		data: Prisma.PasswordResetTokenCreateInput
	): Promise<PasswordResetToken>;
	findByToken(token: string): Promise<PasswordResetToken | null>;
	resetPassword(params: ResetPasswordParams): Promise<void>;
}
