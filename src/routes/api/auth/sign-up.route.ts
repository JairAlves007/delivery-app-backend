import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeRefreshTokenService } from "@/factories/services/auth/make-refresh-token-service.js";
import { makeSignUpService } from "@/factories/services/auth/make-sign-up-service.js";
import { RoleType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { signUpBodySchema } from "@/schemas/auth-schema.js";
import { signUpTokenResponseSchema } from "@/schemas/response-schema.js";

export const signUpRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/sign-up",
		{
			schema: {
				operationId: "signUp",
				tags: customerTags("Auth"),
				summary: "Registrar um novo usuário",
				body: signUpBodySchema,
				response: {
					201: apiSuccessResponseSchema(signUpTokenResponseSchema),
					409: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			}
		},
		async (request, reply) => {
			const body = request.body;

			const signUpService = makeSignUpService();

			const { user, role, establishmentId } = await signUpService.handle({
				...body,
				role: RoleType.CUSTOMER
			});

			const token = await reply.jwtSign(
				{
					role,
					activeTenantId: establishmentId,
					primaryTenantId: null
				},
				{
					sub: user.id,
					expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_TIME
				}
			);

			const refreshTokenService = makeRefreshTokenService();
			const refreshToken = await refreshTokenService.create({
				userId: user.id,
				activeTenantId: establishmentId,
				primaryTenantId: null
			});

			return reply.status(HTTPStatusCodes.CREATED).send(
				ApiResponse.success("Usuário registrado com sucesso", {
					type: Constants.TOKEN_TYPE,
					expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_IN_SECONDS,
					token,
					refreshToken,
					refreshTokenExpiresIn: Constants.REFRESH_TOKEN_EXPIRATION_IN_SECONDS
				})
			);
		}
	);
};
