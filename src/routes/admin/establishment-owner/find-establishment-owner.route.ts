import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeFindEstablishmentOwnerService } from "@/factories/services/establishment-owner/make-find-establishment-owner-service.js";
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
import { establishmentOwnerParamsSchema } from "@/schemas/establishment-owner-schema.js";
import { establishmentOwnerResponseSchema } from "@/schemas/response-schema.js";

export const findEstablishmentOwnerRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/:id",
		{
			schema: {
				operationId: "findEstablishmentOwner",
				tags: ["Establishment Owners"],
				summary: "Encontrar dono de estabelecimento pelo ID",
				params: establishmentOwnerParamsSchema,
				response: {
					200: apiSuccessResponseSchema(establishmentOwnerResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
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
			const { id } = request.params;
			const service = makeFindEstablishmentOwnerService();
			const owner = await service.handle(id);

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"Dono de estabelecimento encontrado com sucesso",
						owner
					)
				);
		}
	);
};
