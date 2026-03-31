import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { ApiResponse } from "@/helpers/api.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema
} from "@/schemas/api-schema.js";
import { healthResponseSchema } from "@/schemas/response-schema.js";

export const healthRoutes = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/ping",
		{
			schema: {
				tags: ["Health"],
				summary: "Verificar integridade da API",
				response: {
					200: apiSuccessResponseSchema(healthResponseSchema),
					500: apiDefaultErrorResponseSchema
				}
			}
		},
		async (request, reply) => {
			return reply
				.status(200)
				.send(ApiResponse.success("OK", { status: "OK" }));
		}
	);
};
