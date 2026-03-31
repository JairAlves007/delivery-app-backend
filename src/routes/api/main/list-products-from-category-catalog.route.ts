import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListProductsFromCategoryCatalogService } from "@/factories/services/product/make-list-products-from-category-catalog-service.js";
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
import { listCursorQueryParamsSchema } from "@/schemas/generic-schema.js";
import { listProductsFromCategorySchema } from "@/schemas/main-schema.js";
import { productsFromCategoryCatalogResponseSchema } from "@/schemas/response-schema.js";

export const listProductsFromCategoryCatalogRoute = async (
	app: FastifyInstance
) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/category/:categoryId/products",
		{
			schema: {
				tags: ["Main (Home)"],
				summary: "Listar produtos de uma categoria na home",
				params: listProductsFromCategorySchema,
				querystring: listCursorQueryParamsSchema,
				response: {
					200: apiSuccessResponseSchema(productsFromCategoryCatalogResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.VIEW_CATALOG])
			]
		},
		async (request, reply) => {
			const query = request.query;
			const { categoryId, establishmentId } = request.params;

			const listProductsFromCategoryCatalogService =
				makeListProductsFromCategoryCatalogService();

			const products = await listProductsFromCategoryCatalogService.handle({
				establishmentId,
				categoryId,
				...query
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"Produtos da categoria listados com sucesso",
						products
					)
				);
		}
	);
};
