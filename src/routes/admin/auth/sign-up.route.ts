import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeSignUpService } from "@/factories/services/auth/make-sign-up-service.js";
import { RoleType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasRoles } from "@/middlewares/ensure-user-has-roles.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
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
				operationId: "adminSignUp",
				tags: ["Admin Auth"],
				summary: "Registrar dono do estabelecimento",
				body: signUpBodySchema,
				response: {
					201: apiSuccessResponseSchema(
						signUpTokenResponseSchema.or(z.object({}))
					),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					409: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [isAuthenticated, ensureUserHasRoles([RoleType.ADMIN])]
		},
		async (request, reply) => {
			const body = request.body;

			const signUpService = makeSignUpService();

			const { user, role, establishmentId } = await signUpService.handle({
				...body,
				role: RoleType.ESTABLISHMENT_OWNER
			});

			if (request.user?.role === RoleType.ADMIN) {
				return reply
					.status(HTTPStatusCodes.CREATED)
					.send(ApiResponse.success("Usuário registrado com sucesso", {}));
			}

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

			return reply.status(HTTPStatusCodes.CREATED).send(
				ApiResponse.success("Usuário registrado com sucesso", {
					type: Constants.TOKEN_TYPE,
					expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_IN_SECONDS,
					token
				})
			);
		}
	);
};
