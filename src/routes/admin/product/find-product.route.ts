import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindProductService } from "@/factories/services/product/make-find-product-service.js";
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
import { productParamsSchema } from "@/schemas/product-schema.js";
import { productResponseSchema } from "@/schemas/response-schema.js";

export const findProductRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/:id",
		{
			schema: {
				tags: ["Products"],
				summary: "Encontrar produto pelo ID",
				params: productParamsSchema,
				response: {
					200: apiSuccessResponseSchema(productResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
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
			const { id } = request.params;

			const findProductService = makeFindProductService();

			const product = await findProductService.handle({
				id,
				filterParams: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Produto encontrado com sucesso", product));
		}
	);
};
