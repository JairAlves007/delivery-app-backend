import type { PasswordResetToken, Prisma } from "@/generated/prisma/client.ts";
import type { ResetPasswordParams } from "@/types/user.ts";

export interface IPasswordResetTokenRepository {
	create(
		data: Prisma.PasswordResetTokenCreateInput
	): Promise<PasswordResetToken>;
	findByToken(token: string): Promise<PasswordResetToken | null>;
	resetPassword(params: ResetPasswordParams): Promise<void>;
}
