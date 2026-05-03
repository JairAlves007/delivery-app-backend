import { compare, hash } from "bcrypt-ts";

import type { PasswordResetToken, Prisma } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { computeLookupHash } from "@/helpers/token.js";
import type { IPasswordResetTokenRepository } from "@/interfaces/repositories/password-reset-token-repository.js";
import prisma from "@/lib/prisma.js";
import type { ResetPasswordParams, UserID } from "@/types/user.js";

export class PasswordResetTokenPrismaRepository implements IPasswordResetTokenRepository {
	async create(
		data: Prisma.PasswordResetTokenCreateInput
	): Promise<PasswordResetToken> {
		return await prisma.passwordResetToken.create({ data });
	}

	async findByToken(token: string): Promise<PasswordResetToken | null> {
		const lookupHash = computeLookupHash(token);

		const candidate = await prisma.passwordResetToken.findUnique({
			where: { lookup_hash: lookupHash }
		});

		if (!candidate) return null;

		if (candidate.used_at !== null) return null;
		if (candidate.expires_at <= new Date()) return null;

		const tokenIsValid = await compare(token, candidate.token_hash);

		if (!tokenIsValid) return null;

		return candidate;
	}

	async invalidatePreviousByUserId(userId: UserID): Promise<void> {
		await prisma.passwordResetToken.updateMany({
			where: {
				user_id: userId,
				used_at: null
			},
			data: {
				used_at: new Date()
			}
		});
	}

	async resetPassword({
		passwordResetToken,
		newPassword
	}: ResetPasswordParams): Promise<void> {
		await prisma.$transaction(async tx => {
			const { id, user_id: userId } = passwordResetToken;

			await tx.passwordResetToken.updateMany({
				where: {
					user_id: userId,
					used_at: null
				},
				data: {
					used_at: new Date()
				}
			});

			await tx.passwordResetToken.update({
				where: { id },
				data: { used_at: new Date() }
			});

			await tx.user.update({
				where: { id: userId },
				data: {
					password: await hash(newPassword, Constants.HASH_SALT_LENGTH)
				}
			});

			await tx.refreshToken.updateMany({
				where: { user_id: userId, revoked_at: null },
				data: { revoked_at: new Date() }
			});
		});
	}
}
