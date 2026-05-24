import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { makeCreateManualClosureService } from "@/factories/services/closure/make-create-manual-closure-service.js";
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
import { manualClosureBodySchema } from "@/schemas/closure-schema.js";
import { closureSchema } from "@/schemas/response-schema.js";

export const createMyManualClosureRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/my/closures/manual",
		{
			schema: {
				operationId: "createMyManualClosure",
				tags: adminTags("Establishments"),
				summary: "Fechar meu estabelecimento manualmente",
				body: manualClosureBodySchema,
				response: {
					201: apiSuccessResponseSchema(closureSchema),
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

			const service = makeCreateManualClosureService();
			const closure = await service.handle({
				establishmentId,
				...data
			});

			return reply
				.status(HTTPStatusCodes.CREATED)
				.send(
					ApiResponse.success("Estabelecimento fechado com sucesso", closure)
				);
		}
	);
};
