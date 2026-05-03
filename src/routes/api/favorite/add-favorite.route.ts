import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeAddFavoriteService } from "@/factories/services/favorite/make-add-favorite-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { userIdSchema } from "@/schemas/generic-schema.js";
import { productParamsSchema } from "@/schemas/product-schema.js";

const responseSchema = z.object({});

export const addFavoriteRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/:id",
		{
			schema: {
				operationId: "addFavorite",
				tags: customerTags("Favorites"),
				summary: "Favoritar um produto",
				params: productParamsSchema,
				response: {
					200: apiSuccessResponseSchema(responseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.ADD_TO_CART])
			]
		},
		async (request, reply) => {
			const { id: productId } = request.params;
			const userId = userIdSchema.parse(request.user.sub);
			const establishmentId = request.user.activeTenantId;

			const service = makeAddFavoriteService();
			await service.handle({ userId, productId, establishmentId });

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Produto favoritado com sucesso"));
		}
	);
};
