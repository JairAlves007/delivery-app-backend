import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeResetPasswordService } from "@/factories/services/auth/make-reset-password-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { resetPasswordBodySchema } from "@/schemas/auth-schema.js";

export const resetPasswordRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/reset-password",
		{
			schema: {
				operationId: "resetPassword",
				tags: ["Auth"],
				summary: "Redefinir senha com token",
				body: resetPasswordBodySchema,
				response: {
					200: apiSuccessResponseSchema(z.object({})),
					401: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			}
		},
		async (request, reply) => {
			const body = request.body;

			const resetPasswordService = makeResetPasswordService();

			await resetPasswordService.handle(body);

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Senha alterada com sucesso", {}));
		}
	);
};
