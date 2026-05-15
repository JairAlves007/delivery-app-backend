import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { makeUpdateEstablishmentService } from "@/factories/services/establishment/make-update-establishment-service.js";
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
import { updateMyEstablishmentBodySchema } from "@/schemas/establishment-schema.js";

export const updateMyEstablishmentRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().patch(
		"/my",
		{
			schema: {
				operationId: "updateMyEstablishment",
				tags: adminTags("Establishments"),
				summary: "Atualizar meu estabelecimento",
				body: updateMyEstablishmentBodySchema,
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
				ensureUserHasPermission([PermissionType.MANAGE_OWN_ESTABLISHMENT])
			]
		},
		async (request, reply) => {
			const establishmentId = request.user.primaryTenantId;

			if (!establishmentId) throw new EstablishmentNotFound();

			const data = request.body;

			const updateEstablishmentService = makeUpdateEstablishmentService();

			await updateEstablishmentService.handle({
				id: establishmentId,
				...data,
				paramsToForget: { establishment_id: establishmentId }
			});

			return reply
				.status(HTTPStatusCodes.NO_CONTENT)
				.send(
					ApiResponse.success("Estabelecimento atualizado com sucesso", {})
				);
		}
	);
};
