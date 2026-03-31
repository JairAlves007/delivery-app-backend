import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindBannerService } from "@/factories/services/banner/make-find-banner-service.js";
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
import { bannerParamsSchema } from "@/schemas/banner-schema.js";
import { bannerResponseSchema } from "@/schemas/response-schema.js";

export const findBannerRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/:id",
		{
			schema: {
				tags: ["Banners"],
				summary: "Encontrar banner pelo ID",
				params: bannerParamsSchema,
				response: {
					200: apiSuccessResponseSchema(bannerResponseSchema),
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

			const findBannerService = makeFindBannerService();

			const banner = await findBannerService.handle({
				id,
				filterParams: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Banner encontrado com sucesso", banner));
		}
	);
};
