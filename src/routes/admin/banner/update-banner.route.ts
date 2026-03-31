import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeUpdateBannerService } from "@/factories/services/banner/make-update-banner-service.js";
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
	bannerParamsSchema,
	createBannerBodySchema
} from "@/schemas/banner-schema.js";

export const updateBannerRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().patch(
		"/:id",
		{
			schema: {
				tags: ["Banners"],
				summary: "Atualizar banner",
				params: bannerParamsSchema,
				body: createBannerBodySchema,
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
				ensureUserHasPermission([PermissionType.MANAGE_BANNERS])
			]
		},
		async (request, reply) => {
			const { id } = request.params;
			const body = request.body;

			const updateBannerService = makeUpdateBannerService();

			await updateBannerService.handle({
				id,
				...body,
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.NO_CONTENT)
				.send(ApiResponse.success("Banner atualizado com sucesso", {}));
		}
	);
};
