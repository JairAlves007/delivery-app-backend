import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeSignUpService } from "@/factories/services/auth/make-sign-up-service.js";
import { RoleType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasRoles } from "@/middlewares/ensure-user-has-roles.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { signUpBodySchema } from "@/schemas/auth-schema.js";

export const signUpRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/sign-up",
		{
			schema: {
				operationId: "establishmentOwnerSignUp",
				tags: ["Admin Auth"],
				summary: "Registrar dono do estabelecimento",
				body: signUpBodySchema,
				response: {
					201: apiSuccessResponseSchema(z.object({})),
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

			await signUpService.handle({
				...body,
				role: RoleType.ESTABLISHMENT_OWNER
			});

			return reply
				.status(HTTPStatusCodes.CREATED)
				.send(ApiResponse.success("Usuário registrado com sucesso", {}));
		}
	);
};
