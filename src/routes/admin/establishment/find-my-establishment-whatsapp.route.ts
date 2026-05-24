import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { makeFindEstablishmentWhatsAppIntegrationService } from "@/factories/services/whatsapp/make-find-establishment-whatsapp-integration-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { adminTags } from "@/http/swagger-tags.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema
} from "@/schemas/api-schema.js";
import { whatsAppIntegrationNullableResponseSchema } from "@/schemas/whatsapp-schema.js";
import { mapWhatsAppIntegrationNullable } from "@/services/whatsapp/map-whatsapp-integration.js";

export const findMyEstablishmentWhatsAppRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/my/whatsapp",
		{
			schema: {
				operationId: "findMyEstablishmentWhatsApp",
				tags: adminTags("Establishments"),
				summary: "Buscar integração WhatsApp do meu estabelecimento",
				response: {
					200: apiSuccessResponseSchema(
						whatsAppIntegrationNullableResponseSchema
					),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_OWN_ESTABLISHMENT])
			]
		},
		async (request, reply) => {
			const establishmentId = getUserEstablishmentId(request.user);

			if (!establishmentId) throw new EstablishmentNotFound();

			const service = makeFindEstablishmentWhatsAppIntegrationService();
			const integration = await service.handle(establishmentId);

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"Integração recuperada com sucesso",
						mapWhatsAppIntegrationNullable(integration)
					)
				);
		}
	);
};
