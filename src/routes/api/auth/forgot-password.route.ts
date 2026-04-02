import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeForgotPasswordService } from "@/factories/services/auth/make-forgot-password-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { forgotPasswordBodySchema } from "@/schemas/auth-schema.js";

export const forgotPasswordRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/forgot-password",
		{
			schema: {
				operationId: "forgotPassword",
				tags: ["Auth"],
				summary: "Solicitar redefinição de senha",
				body: forgotPasswordBodySchema,
				response: {
					200: apiSuccessResponseSchema(z.object({})),
					404: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			}
		},
		async (request, reply) => {
			const { email } = request.body;

			const forgotPasswordService = makeForgotPasswordService();

			await forgotPasswordService.handle(email);

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"E-mail de recuperação na área! Corre lá na sua caixa pra conferir!",
						{}
					)
				);
		}
	);
};
