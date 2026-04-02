import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListDistrictService } from "@/factories/services/district/make-list-district-service.js";
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
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { districtListResponseSchema } from "@/schemas/response-schema.js";

export const listDistrictsRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/",
		{
			schema: {
				operationId: "listDistricts",
				tags: ["Districts"],
				summary: "Listar bairros",
				querystring: listQueryParamsSchema,
				response: {
					200: apiSuccessResponseSchema(districtListResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
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
			const { search, sortField, sortDirection, ...query } = request.query;

			const listDistrictService = makeListDistrictService();

			const districts = await listDistrictService.handle({
				...query,
				filterParams: {
					establishment_id: request.user.primaryTenantId,
					search,
					sortField,
					sortDirection
				}
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Bairros listados com sucesso", districts));
		}
	);
};
