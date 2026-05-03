import type { PasswordResetToken, Prisma } from "@/generated/prisma/client.js";
import type { ResetPasswordParams, UserID } from "@/types/user.js";

export interface IPasswordResetTokenRepository {
	create(
		data: Prisma.PasswordResetTokenCreateInput
	): Promise<PasswordResetToken>;
	findByToken(token: string): Promise<PasswordResetToken | null>;
	invalidatePreviousByUserId(userId: UserID): Promise<void>;
	resetPassword(params: ResetPasswordParams): Promise<void>;
}
