import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListEstablishmentOwnerService } from "@/factories/services/establishment-owner/make-list-establishment-owner-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { establishmentOwnerListResponseSchema } from "@/schemas/response-schema.js";

export const listEstablishmentOwnersRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/",
		{
			schema: {
				operationId: "listEstablishmentOwners",
				tags: adminTags("Establishment Owners"),
				summary: "Listar donos de estabelecimento",
				querystring: listQueryParamsSchema,
				response: {
					200: apiSuccessResponseSchema(establishmentOwnerListResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_USERS])
			]
		},
		async (request, reply) => {
			const service = makeListEstablishmentOwnerService();
			const owners = await service.handle(request.query);

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"Donos de estabelecimento listados com sucesso",
						owners
					)
				);
		}
	);
};
