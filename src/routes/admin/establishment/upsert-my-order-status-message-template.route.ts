import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { makeUpsertOrderStatusMessageTemplateService } from "@/factories/services/whatsapp/make-upsert-order-status-message-template-service.js";
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
	orderStatusMessageTemplateResponseSchema,
	upsertOrderStatusMessageTemplateBodySchema,
	upsertOrderStatusMessageTemplateParamsSchema
} from "@/schemas/whatsapp-schema.js";
import { mapOrderStatusMessageTemplate } from "@/services/whatsapp/map-order-status-message-template.js";

export const upsertMyOrderStatusMessageTemplateRoute = async (
	app: FastifyInstance
) => {
	app.withTypeProvider<ZodTypeProvider>().put(
		"/my/whatsapp/templates/:trigger",
		{
			schema: {
				operationId: "upsertMyOrderStatusMessageTemplate",
				tags: adminTags("Establishments"),
				summary: "Criar ou atualizar template de mensagem por gatilho",
				params: upsertOrderStatusMessageTemplateParamsSchema,
				body: upsertOrderStatusMessageTemplateBodySchema,
				response: {
					200: apiSuccessResponseSchema(
						orderStatusMessageTemplateResponseSchema
					),
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
			const establishmentId = getUserEstablishmentId(request.user);

			if (!establishmentId) throw new EstablishmentNotFound();

			const service = makeUpsertOrderStatusMessageTemplateService();
			const template = await service.handle({
				establishmentId,
				trigger: request.params.trigger,
				enabled: request.body.enabled,
				templateText: request.body.templateText
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success(
						"Template salvo com sucesso",
						mapOrderStatusMessageTemplate(template)
					)
				);
		}
	);
};
