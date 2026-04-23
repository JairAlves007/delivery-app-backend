import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListTagService } from "@/factories/services/tag/make-list-tag-service.js";
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
import { tagListResponseSchema } from "@/schemas/response-schema.js";

export const listTagsRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/",
		{
			schema: {
				operationId: "listTags",
				tags: ["Tags"],
				summary: "Listar tags",
				response: {
					200: apiSuccessResponseSchema(tagListResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_PRODUCTS])
			]
		},
		async (request, reply) => {
			const listTagService = makeListTagService();

			const tags = await listTagService.handle({
				filterParams: {
					establishment_id: request.user.primaryTenantId
				}
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Tags listadas com sucesso", tags));
		}
	);
};
