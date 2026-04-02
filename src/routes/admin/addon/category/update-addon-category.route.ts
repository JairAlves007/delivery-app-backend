import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeUpdateAddonCategoryService } from "@/factories/services/addon/category/make-update-addon-category-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	addonCategoryParamsSchema,
	updateAddonCategoryBodySchema
} from "@/schemas/addon-category-schema.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";

export const updateAddonCategoryRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().patch(
		"/:id",
		{
			schema: {
				operationId: "updateAddonCategory",
				tags: ["Addon Categories"],
				summary: "Atualizar categoria de adicionais",
				params: addonCategoryParamsSchema,
				body: updateAddonCategoryBodySchema,
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
			const body = request.body;

			const updateAddonCategoryService = makeUpdateAddonCategoryService();

			await updateAddonCategoryService.handle({
				id,
				...body,
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.NO_CONTENT)
				.send(
					ApiResponse.success(
						"Categoria de adicional atualizada com sucesso",
						{}
					)
				);
		}
	);
};
