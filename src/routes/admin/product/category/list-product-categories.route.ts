import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListProductCategoryService } from "@/factories/services/product/category/make-list-product-category-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { resolveEstablishmentScope } from "@/helpers/resolve-establishment-scope.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { productCategoryListResponseSchema } from "@/schemas/response-schema.js";

export const listProductCategoriesRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/",
		{
			schema: {
				operationId: "listProductCategories",
				tags: ["Product Categories"],
				summary: "Listar categorias de produtos",
				querystring: listQueryParamsSchema,
				response: {
					200: apiSuccessResponseSchema(productCategoryListResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_CATEGORIES])
			]
		},
		async (request, reply) => {
			const { establishmentId, ...query } = request.query;

			const listProductCategoryService = makeListProductCategoryService();

			const productCategories = await listProductCategoryService.handle({
				...query,
				filterParams: {
					establishment_id: resolveEstablishmentScope({
						role: request.user.role,
						primaryTenantId: request.user.primaryTenantId,
						establishmentId
					})
				}
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"Categorias de produtos listadas com sucesso",
						productCategories
					)
				);
		}
	);
};
