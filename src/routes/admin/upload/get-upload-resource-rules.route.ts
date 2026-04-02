import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeGetUploadResourceRulesService } from "@/factories/services/upload/make-get-upload-resource-rules-service.js";
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
import { resourceRuleResponseSchema } from "@/schemas/response-schema.js";
import { uploadResourceRulesQuerySchema } from "@/schemas/upload-schema.js";

export const getUploadResourceRulesRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/rules",
		{
			schema: {
				operationId: "getUploadResourceRules",
				tags: ["Uploads"],
				summary: "Obter regras para recursos enviados por upload",
				querystring: uploadResourceRulesQuerySchema,
				response: {
					200: apiSuccessResponseSchema(z.array(resourceRuleResponseSchema)),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([
					PermissionType.MANAGE_ESTABLISHMENTS,
					PermissionType.MANAGE_BANNERS,
					PermissionType.MANAGE_PRODUCTS
				])
			]
		},
		async (request, reply) => {
			const query = request.query;

			const getUploadResourceRulesService = makeGetUploadResourceRulesService();

			const uploadRules = await getUploadResourceRulesService.handle(query);

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"Regras de acesso obtidas com sucesso",
						uploadRules
					)
				);
		}
	);
};
