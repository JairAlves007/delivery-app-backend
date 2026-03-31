import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeDeleteAddonCategoryService } from "@/factories/services/addon/category/make-delete-addon-category-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import { addonCategoryParamsSchema } from "@/schemas/addon-category-schema.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";

export const deleteAddonCategoryRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().delete(
		"/:id",
		{
			schema: {
				tags: ["Addon Categories"],
				summary: "Deletar categoria de adicionais",
				params: addonCategoryParamsSchema,
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
				ensureUserHasPermission([PermissionType.MANAGE_PRODUCT_OPTIONS])
			]
		},
		async (request, reply) => {
			const { id } = request.params;

			const deleteAddonCategoryService = makeDeleteAddonCategoryService();

			await deleteAddonCategoryService.handle({
				id,
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.NO_CONTENT)
				.send(
					ApiResponse.success("Categoria de adicional deletada com sucesso", {})
				);
		}
	);
};
