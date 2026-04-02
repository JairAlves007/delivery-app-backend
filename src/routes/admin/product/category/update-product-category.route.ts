import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeUpdateProductCategoryService } from "@/factories/services/product/category/make-update-product-category-service.js";
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
	productCategoryParamsSchema,
	updateProductCategoryBodySchema
} from "@/schemas/product-category-schema.js";

export const updateProductCategoryRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().patch(
		"/:id",
		{
			schema: {
				operationId: "updateProductCategory",
				tags: ["Product Categories"],
				summary: "Atualizar categoria de produtos",
				params: productCategoryParamsSchema,
				body: updateProductCategoryBodySchema,
				response: {
					204: apiSuccessResponseSchema(z.object({})),
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
			const data = request.body;

			const updateProductCategoryService = makeUpdateProductCategoryService();

			await updateProductCategoryService.handle({
				id,
				...data,
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.NO_CONTENT)
				.send(
					ApiResponse.success("Categoria de produto atualizada com sucesso", {})
				);
		}
	);
};
