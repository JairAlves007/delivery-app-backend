import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { makeConnectEstablishmentWhatsAppService } from "@/factories/services/whatsapp/make-connect-establishment-whatsapp-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { getUserEstablishmentId } from "@/helpers/get-user-establishment-id.js";
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
	connectWhatsAppBodySchema,
	whatsAppIntegrationResponseSchema
} from "@/schemas/whatsapp-schema.js";
import { mapWhatsAppIntegration } from "@/services/whatsapp/map-whatsapp-integration.js";

export const connectMyEstablishmentWhatsAppRoute = async (
	app: FastifyInstance
) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/my/whatsapp/connect",
		{
			schema: {
				operationId: "connectMyEstablishmentWhatsApp",
				tags: adminTags("Establishments"),
				summary: "Conectar WhatsApp do meu estabelecimento",
				body: connectWhatsAppBodySchema,
				response: {
					200: apiSuccessResponseSchema(whatsAppIntegrationResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema,
					502: apiDefaultErrorResponseSchema
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

			const service = makeConnectEstablishmentWhatsAppService();
			const integration = await service.handle({
				establishmentId,
				metaPhoneNumberId: request.body.metaPhoneNumberId,
				metaWabaId: request.body.metaWabaId,
				metaAccessToken: request.body.metaAccessToken
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"WhatsApp conectado com sucesso",
						mapWhatsAppIntegration(integration)
					)
				);
		}
	);
};
