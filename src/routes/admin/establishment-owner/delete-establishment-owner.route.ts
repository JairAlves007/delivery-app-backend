import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeDeleteEstablishmentOwnerService } from "@/factories/services/establishment-owner/make-delete-establishment-owner-service.js";
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

export const deleteEstablishmentOwnerRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().delete(
		"/:id",
		{
			schema: {
				operationId: "deleteEstablishmentOwner",
				tags: ["Establishment Owners"],
				summary: "Deletar dono de estabelecimento",
				params: establishmentOwnerParamsSchema,
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
				ensureUserHasPermission([PermissionType.MANAGE_USERS])
			]
		},
		async (request, reply) => {
			const { id } = request.params;

			const service = makeDeleteEstablishmentOwnerService();
			await service.handle({ id, paramsToForget: {} });

			return reply
				.status(HTTPStatusCodes.NO_CONTENT)
				.send(
					ApiResponse.success(
						"Dono de estabelecimento deletado com sucesso",
						{}
					)
				);
		}
	);
};
