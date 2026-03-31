import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeDeleteDistrictService } from "@/factories/services/district/make-delete-district-service.js";
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

export const deleteDistrictRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().delete(
		"/:id",
		{
			schema: {
				tags: ["Districts"],
				summary: "Deletar bairro",
				params: districtParamsSchema,
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
				ensureUserHasPermission([PermissionType.MANAGE_DISTRICTS])
			]
		},
		async (request, reply) => {
			const { id } = request.params;

			const deleteDistrictService = makeDeleteDistrictService();

			await deleteDistrictService.handle({
				id,
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.NO_CONTENT)
				.send(ApiResponse.success("Bairro deletado com sucesso", {}));
		}
	);
};
