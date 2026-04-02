import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindProductCategoryService } from "@/factories/services/product/category/make-find-product-category-service.js";
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
import { productCategoryParamsSchema } from "@/schemas/product-category-schema.js";
import { productCategoryResponseSchema } from "@/schemas/response-schema.js";

export const findProductCategoryRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/:id",
		{
			schema: {
				operationId: "findProductCategory",
				tags: ["Product Categories"],
				summary: "Encontrar categoria de produtos pelo ID",
				params: productCategoryParamsSchema,
				response: {
					200: apiSuccessResponseSchema(productCategoryResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
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
			const { id } = request.params;

			const findProductCategoryService = makeFindProductCategoryService();

			const productCategory = await findProductCategoryService.handle({
				id,
				filterParams: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"Categoria de produto encontrado com sucesso",
						productCategory
					)
				);
		}
	);
};
