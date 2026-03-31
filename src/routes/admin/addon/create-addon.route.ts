import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeCreateAddonService } from "@/factories/services/addon/make-create-addon-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import { createAddonBodySchema } from "@/schemas/addon-schema.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";

export const createAddonRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/",
		{
			schema: {
				tags: ["Addons"],
				summary: "Criar adicional",
				body: createAddonBodySchema,
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
				ensureUserHasPermission([PermissionType.MANAGE_PRODUCT_OPTIONS])
			]
		},
		async (request, reply) => {
			const body = request.body;

			const createAddonService = makeCreateAddonService();

			await createAddonService.handle({
				...body,
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.CREATED)
				.send(
					ApiResponse.success("Categoria de adicional criada com sucesso", {})
				);
		}
	);
};
