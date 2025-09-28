import Constants from "@/helpers/constants.ts";
import type { IPasswordResetTokenRepository } from "@/interfaces/repositories/password-reset-token-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { ResetPasswordParams } from "@/types/user.ts";
import type { Prisma, PasswordResetToken } from "@prisma/client";
import { hash, compare } from "bcrypt-ts";

export class PasswordResetTokenPrismaRepository
	implements IPasswordResetTokenRepository
{
	async create(
		data: Prisma.PasswordResetTokenCreateInput
	): Promise<PasswordResetToken> {
		return await prisma.passwordResetToken.create({ data });
	}

	async findByToken(token: string): Promise<PasswordResetToken | null> {
		const tokens = await prisma.passwordResetToken.findMany({
			where: {
				used_at: null,
				expires_at: { gt: new Date() }
			}
		});

		for (const t of tokens) {
			const tokenIsValid = await compare(token, t.token_hash);

			if (tokenIsValid) {
				return t;
			}
		}

		return null;
	}

	async resetPassword({
		passwordResetToken,
		newPassword
	}: ResetPasswordParams): Promise<void> {
		await prisma.$transaction(async tx => {
			const { id, user_id: userId } = passwordResetToken;

			await tx.passwordResetToken.deleteMany({
				where: {
					user_id: userId,
					OR: [{ expires_at: { lt: new Date() } }, { used_at: { not: null } }]
				}
			});

			await tx.passwordResetToken.update({
				where: {
					id
				},
				data: {
					used_at: new Date()
				}
			});

			await tx.user.update({
				where: {
					id: userId
				},
				data: {
					password: await hash(newPassword, Constants.HASH_SALT_LENGTH)
				}
			});
		});
	}
}
