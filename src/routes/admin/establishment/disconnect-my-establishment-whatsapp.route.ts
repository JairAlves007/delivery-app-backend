import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { makeDisconnectEstablishmentWhatsAppService } from "@/factories/services/whatsapp/make-disconnect-establishment-whatsapp-service.js";
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

export const disconnectMyEstablishmentWhatsAppRoute = async (
	app: FastifyInstance
) => {
	app.withTypeProvider<ZodTypeProvider>().delete(
		"/my/whatsapp",
		{
			schema: {
				operationId: "disconnectMyEstablishmentWhatsApp",
				tags: adminTags("Establishments"),
				summary: "Desconectar WhatsApp do meu estabelecimento",
				response: {
					200: apiSuccessResponseSchema(z.null()),
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

			const service = makeDisconnectEstablishmentWhatsAppService();
			await service.handle(establishmentId);

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("WhatsApp desconectado com sucesso", null));
		}
	);
};
