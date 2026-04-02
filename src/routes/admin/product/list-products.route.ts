import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListProductService } from "@/factories/services/product/make-list-product-service.js";
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
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { productListResponseSchema } from "@/schemas/response-schema.js";

export const listProductsRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/",
		{
			schema: {
				operationId: "listProducts",
				tags: ["Products"],
				summary: "Listar produtos",
				querystring: listQueryParamsSchema,
				response: {
					200: apiSuccessResponseSchema(productListResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
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
			const { search, sortField, sortDirection, ...query } = request.query;

			const listProductService = makeListProductService();

			const products = await listProductService.handle({
				...query,
				filterParams: {
					establishment_id: request.user.primaryTenantId,
					search,
					sortField,
					sortDirection
				}
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Produtos listados com sucesso", products));
		}
	);
};
