import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeRefreshTokenService } from "@/factories/services/auth/make-refresh-token-service.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { refreshTokenBodySchema } from "@/schemas/auth-schema.js";
import { refreshTokenResponseSchema } from "@/schemas/response-schema.js";

export const refreshTokenRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/refresh-token",
		{
			schema: {
				operationId: "refreshToken",
				tags: ["Auth"],
				summary: "Renovar token de acesso",
				body: refreshTokenBodySchema,
				response: {
					200: apiSuccessResponseSchema(refreshTokenResponseSchema),
					401: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			}
		},
		async (request, reply) => {
			const body = request.body;
			const { refreshToken } = body;

			const refreshTokenService = makeRefreshTokenService();

			const { activeTenantId, primaryTenantId, role, userId } =
				await refreshTokenService.validate(refreshToken);

			const token = await reply.jwtSign(
				{
					role,
					activeTenantId,
					primaryTenantId
				},
				{
					sub: userId,
					expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_TIME
				}
			);

			await refreshTokenService.revoke(refreshToken);

			const newRefreshToken = await refreshTokenService.create({
				userId,
				activeTenantId,
				primaryTenantId
			});

			return reply.status(HTTPStatusCodes.OK).send(
				ApiResponse.success("Token renovado com sucesso", {
					type: Constants.TOKEN_TYPE,
					expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_IN_SECONDS,
					token,
					refreshToken: newRefreshToken,
					refreshTokenExpiresIn: Constants.REFRESH_TOKEN_EXPIRATION_IN_SECONDS
				})
			);
		}
	);
};
