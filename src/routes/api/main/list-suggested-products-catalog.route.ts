import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListSuggestedProductsCatalogService } from "@/factories/services/product/make-list-suggested-products-catalog-service.js";
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
import {
	listSuggestedProductsParamsSchema,
	listSuggestedProductsQuerySchema
} from "@/schemas/main-schema.js";
import { suggestedProductsCatalogResponseSchema } from "@/schemas/response-schema.js";

export const listSuggestedProductsCatalogRoute = async (
	app: FastifyInstance
) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/product/:productId/suggested",
		{
			schema: {
				operationId: "listSuggestedProductsCatalog",
				tags: ["Main (Home)"],
				summary: "Listar produtos sugeridos a partir de um produto",
				params: listSuggestedProductsParamsSchema,
				querystring: listSuggestedProductsQuerySchema,
				response: {
					200: apiSuccessResponseSchema(suggestedProductsCatalogResponseSchema),
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
			const { productId } = request.params;
			const { limit } = request.query;

			const listSuggestedProductsCatalogService =
				makeListSuggestedProductsCatalogService();

			const products = await listSuggestedProductsCatalogService.handle({
				establishmentId: request.user.activeTenantId,
				productId,
				limit
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"Produtos sugeridos listados com sucesso",
						products
					)
				);
		}
	);
};
