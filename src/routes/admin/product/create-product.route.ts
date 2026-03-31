import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeCreateProductService } from "@/factories/services/product/make-create-product-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { createProductBodySchema } from "@/schemas/product-schema.js";

export const createProductRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/",
		{
			schema: {
				tags: ["Products"],
				summary: "Criar produto",
				body: createProductBodySchema,
				response: {
					201: apiSuccessResponseSchema(z.object({})),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					409: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_PRODUCTS])
			]
		},
		async (request, reply) => {
			const body = request.body;

			const createProductService = makeCreateProductService();

			await createProductService.handle({
				...body,
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.CREATED)
				.send(ApiResponse.success("Produto criado com sucesso", {}));
		}
	);
};
