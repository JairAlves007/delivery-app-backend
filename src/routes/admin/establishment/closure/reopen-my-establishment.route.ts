import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { makeReopenEstablishmentService } from "@/factories/services/closure/make-reopen-establishment-service.js";
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

export const reopenMyEstablishmentRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().delete(
		"/my/closures/active",
		{
			schema: {
				operationId: "reopenMyEstablishment",
				tags: adminTags("Establishments"),
				summary: "Reabrir meu estabelecimento (encerra fechamentos ativos)",
				response: {
					200: apiSuccessResponseSchema(z.object({ endedCount: z.number() })),
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

			const service = makeReopenEstablishmentService();
			const result = await service.handle({ establishmentId });

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success("Estabelecimento reaberto com sucesso", result)
				);
		}
	);
};
