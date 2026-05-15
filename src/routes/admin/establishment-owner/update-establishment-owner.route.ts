import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeUpdateEstablishmentOwnerService } from "@/factories/services/establishment-owner/make-update-establishment-owner-service.js";
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
import {
	establishmentOwnerParamsSchema,
	updateEstablishmentOwnerBodySchema
} from "@/schemas/establishment-owner-schema.js";

export const updateEstablishmentOwnerRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().patch(
		"/:id",
		{
			schema: {
				operationId: "updateEstablishmentOwner",
				tags: adminTags("Establishment Owners"),
				summary: "Atualizar dono de estabelecimento",
				params: establishmentOwnerParamsSchema,
				body: updateEstablishmentOwnerBodySchema,
				response: {
					204: apiSuccessResponseSchema(z.object({})),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					409: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_ESTABLISHMENT_OWNERS])
			]
		},
		async (request, reply) => {
			const { id } = request.params;
			const data = request.body;

			const service = makeUpdateEstablishmentOwnerService();
			await service.handle({ id, ...data, paramsToForget: {} });

			return reply
				.status(HTTPStatusCodes.NO_CONTENT)
				.send(
					ApiResponse.success(
						"Dono de estabelecimento atualizado com sucesso",
						{}
					)
				);
		}
	);
};
