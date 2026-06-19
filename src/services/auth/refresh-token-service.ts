import { compare, hash } from "bcrypt-ts";

import { InvalidRefreshToken } from "@/errors/user/invalid-refresh-token-error.js";
import { makeFindUserService } from "@/factories/services/user/make-find-user-service.js";
import { RoleType } from "@/generated/prisma/browser.js";
import Constants from "@/helpers/constants.js";
import type { IRefreshTokenRepository } from "@/interfaces/repositories/refresh-token-repository.js";
import type { UserID } from "@/types/user.js";

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

	private parseToken(token: string): { id: number; secret: string } | null {
		const separatorIndex = token.indexOf(".");
		if (separatorIndex <= 0) return null;

		const id = Number(token.slice(0, separatorIndex));
		const secret = token.slice(separatorIndex + 1);

		if (!Number.isInteger(id) || id <= 0 || secret.length === 0) return null;

		return { id, secret };
	}

	private async resolveValidToken(token: string) {
		const parsed = this.parseToken(token);
		if (!parsed) return null;

		const refreshToken = await this.refreshTokenRepository.findValidById(
			parsed.id
		);
		if (!refreshToken) return null;

		const secretIsValid = await compare(parsed.secret, refreshToken.token_hash);
		if (!secretIsValid) return null;

		return refreshToken;
	}

	async create({
		userId,
		activeTenantId,
		primaryTenantId
	}: CreateRefreshTokenParams): Promise<string> {
		const secret = crypto.randomUUID();
		const tokenHash = await hash(secret, Constants.BCRYPT_COST);

		const expiresAt = new Date();
		expiresAt.setSeconds(
			expiresAt.getSeconds() + Constants.REFRESH_TOKEN_EXPIRATION_IN_SECONDS
		);

		const created = await this.refreshTokenRepository.create({
			user: { connect: { id: userId } },
			token_hash: tokenHash,
			active_tenant_id: activeTenantId,
			primary_tenant_id: primaryTenantId,
			expires_at: expiresAt
		});

		return `${created.id}.${secret}`;
	}

	async validate(token: string): Promise<RefreshTokenPayload> {
		const refreshToken = await this.resolveValidToken(token);

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
		const refreshToken = await this.resolveValidToken(token);

		if (!refreshToken) return;

		await this.refreshTokenRepository.revoke(refreshToken.id);
	}

	async revokeAll(userId: UserID): Promise<void> {
		await this.refreshTokenRepository.revokeAllByUserId(userId);
	}
}
