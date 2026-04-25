import { hash } from "bcrypt-ts";

import { InvalidRefreshToken } from "@/errors/user/invalid-refresh-token-error.js";
import { makeFindUserService } from "@/factories/services/user/make-find-user-service.js";
import { RoleType } from "@/generated/prisma/browser.js";
import Constants from "@/helpers/constants.js";
import type { IRefreshTokenRepository } from "@/interfaces/repositories/refresh-token-repository.js";
import { UserID } from "@/types/user.js";

interface RefreshTokenPayload {
	userId: UserID;
	role: RoleType;
	activeTenantId: string;
	primaryTenantId: string | null;
}

interface CreateRefreshTokenParams {
	userId: UserID;
	activeTenantId: string;
	primaryTenantId: string | null;
}

export class RefreshTokenService {
	private refreshTokenRepository: IRefreshTokenRepository;

	constructor(refreshTokenRepository: IRefreshTokenRepository) {
		this.refreshTokenRepository = refreshTokenRepository;
	}

	async create({
		userId,
		activeTenantId,
		primaryTenantId
	}: CreateRefreshTokenParams): Promise<string> {
		const token = crypto.randomUUID();
		const tokenHash = await hash(token, Constants.HASH_SALT_LENGTH);

		const expiresAt = new Date();
		expiresAt.setSeconds(
			expiresAt.getSeconds() + Constants.REFRESH_TOKEN_EXPIRATION_IN_SECONDS
		);

		await this.refreshTokenRepository.create({
			user: { connect: { id: userId } },
			token_hash: tokenHash,
			active_tenant_id: activeTenantId,
			primary_tenant_id: primaryTenantId,
			expires_at: expiresAt
		});

		return token;
	}

	async validate(token: string): Promise<RefreshTokenPayload> {
		const refreshToken = await this.refreshTokenRepository.findByToken(token);

		if (!refreshToken) throw new InvalidRefreshToken();

		const findUserService = makeFindUserService();
		const user = await findUserService.handle(refreshToken.user_id);

		if (!user || user.deleted_at) throw new InvalidRefreshToken();

		return {
			userId: user.id,
			role: user.role.name,
			activeTenantId: refreshToken.active_tenant_id,
			primaryTenantId: refreshToken.primary_tenant_id
		};
	}

	async revoke(token: string): Promise<void> {
		const refreshToken = await this.refreshTokenRepository.findByToken(token);

		if (!refreshToken) return;

		await this.refreshTokenRepository.revoke(refreshToken.id);
	}

	async revokeAll(userId: string): Promise<void> {
		await this.refreshTokenRepository.revokeAllByUserId(userId);
	}
}
