import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { makeListOrderStatusMessageTemplatesService } from "@/factories/services/whatsapp/make-list-order-status-message-templates-service.js";
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
import { orderStatusMessageTemplatesListResponseSchema } from "@/schemas/whatsapp-schema.js";
import { mapOrderStatusMessageTemplate } from "@/services/whatsapp/map-order-status-message-template.js";

export const listMyOrderStatusMessageTemplatesRoute = async (
	app: FastifyInstance
) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/my/whatsapp/templates",
		{
			schema: {
				operationId: "listMyOrderStatusMessageTemplates",
				tags: adminTags("Establishments"),
				summary: "Listar templates de mensagens do meu estabelecimento",
				response: {
					200: apiSuccessResponseSchema(
						orderStatusMessageTemplatesListResponseSchema
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

			const service = makeListOrderStatusMessageTemplatesService();
			const templates = await service.handle(establishmentId);

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"Templates recuperados com sucesso",
						templates.map(mapOrderStatusMessageTemplate)
					)
				);
		}
	);
};
