import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListEstablishmentService } from "@/factories/services/establishment/make-list-establishment-service.js";
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
import { establishmentListResponseSchema } from "@/schemas/response-schema.js";

export const listEstablishmentsRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/",
		{
			schema: {
				operationId: "listEstablishments",
				tags: ["Establishments"],
				summary: "Listar estabelecimentos",
				querystring: listQueryParamsSchema,
				response: {
					200: apiSuccessResponseSchema(establishmentListResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_ESTABLISHMENTS])
			]
		},
		async (request, reply) => {
			const query = request.query;

			const listEstablishmentService = makeListEstablishmentService();

			const establishments = await listEstablishmentService.handle(query);

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"Estabelecimentos listados com sucesso",
						establishments
					)
				);
		}
	);
};
