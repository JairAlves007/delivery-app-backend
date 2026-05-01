import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeUpdateEstablishmentService } from "@/factories/services/establishment/make-update-establishment-service.js";
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
	establishmentParamsSchema,
	updateEstablishmentBodySchema
} from "@/schemas/establishment-schema.js";

export const updateEstablishmentRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().patch(
		"/:id",
		{
			schema: {
				operationId: "updateEstablishment",
				tags: adminTags("Establishments"),
				summary: "Atualizar estabelecimento",
				params: establishmentParamsSchema,
				body: updateEstablishmentBodySchema,
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
				ensureUserHasPermission([PermissionType.MANAGE_ESTABLISHMENTS])
			]
		},
		async (request, reply) => {
			const data = request.body;
			const establishmentId = getUserEstablishmentId(request.user);
			const { id } = request.params;

			const updateEstablishmentService = makeUpdateEstablishmentService();

			await updateEstablishmentService.handle({
				id,
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
