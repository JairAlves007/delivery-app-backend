import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeCreateProductCategoryService } from "@/factories/services/product/category/make-create-product-category-service.js";
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
import { createProductCategoryBodySchema } from "@/schemas/product-category-schema.js";

export const createProductCategoryRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/",
		{
			schema: {
				tags: ["Product Categories"],
				summary: "Criar categoria de produtos",
				body: createProductCategoryBodySchema,
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
				ensureUserHasPermission([PermissionType.MANAGE_CATEGORIES])
			]
		},
		async (request, reply) => {
			const body = request.body;

			const createProductCategoryService = makeCreateProductCategoryService();

			await createProductCategoryService.handle({
				...body,
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.CREATED)
				.send(ApiResponse.success("Categoria de produto criada com sucesso", {}));
		}
	);
};
