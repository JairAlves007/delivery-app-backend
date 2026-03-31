import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindDistrictService } from "@/factories/services/district/make-find-district-service.js";
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
import { districtParamsSchema } from "@/schemas/district-schema.js";
import { districtResponseSchema } from "@/schemas/response-schema.js";

export const findDistrictRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/:id",
		{
			schema: {
				tags: ["Districts"],
				summary: "Encontrar bairro pelo ID",
				params: districtParamsSchema,
				response: {
					200: apiSuccessResponseSchema(districtResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_DISTRICTS])
			]
		},
		async (request, reply) => {
			const { id } = request.params;

			const findDistrictService = makeFindDistrictService();

			const district = await findDistrictService.handle({
				id,
				filterParams: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Bairro encontrado com sucesso", district));
		}
	);
};
