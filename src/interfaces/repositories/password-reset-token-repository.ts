import type {
	FindByPasswordTokenParams,
	ResetPasswordParams
} from "@/types/user.ts";
import type { PasswordResetToken, Prisma } from "@prisma/client";

export interface IPasswordResetTokenRepository {
	create(
		data: Prisma.PasswordResetTokenCreateInput
	): Promise<PasswordResetToken>;
	findByToken(
		params: FindByPasswordTokenParams
	): Promise<PasswordResetToken | null>;
	resetPassword(params: ResetPasswordParams): Promise<void>;
}
