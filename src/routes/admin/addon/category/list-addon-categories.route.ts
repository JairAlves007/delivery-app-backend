import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListAddonCategoryService } from "@/factories/services/addon/category/make-list-addon-category-service.js";
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
import { addonCategoryListResponseSchema } from "@/schemas/response-schema.js";

export const listAddonCategoriesRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/",
		{
			schema: {
				tags: ["Addon Categories"],
				summary: "Listar categorias de adicionais",
				querystring: listQueryParamsSchema,
				response: {
					200: apiSuccessResponseSchema(addonCategoryListResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_PRODUCT_OPTIONS])
			]
		},
		async (request, reply) => {
			const { search, sortField, sortDirection, ...query } = request.query;

			const listAddonCategoryService = makeListAddonCategoryService();

			const addonCategories = await listAddonCategoryService.handle({
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
				.send(
					ApiResponse.success(
						"Categorias de adicionais listadas com sucesso",
						addonCategories
					)
				);
		}
	);
};
