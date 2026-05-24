import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

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
import { establishmentClosureParamsSchema } from "@/schemas/closure-schema.js";

export const reopenEstablishmentRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().delete(
		"/:id/closures/active",
		{
			schema: {
				operationId: "reopenEstablishment",
				tags: adminTags("Establishments"),
				summary: "Reabrir estabelecimento (encerra fechamentos ativos)",
				params: establishmentClosureParamsSchema,
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
				ensureUserHasPermission([PermissionType.MANAGE_ESTABLISHMENTS])
			]
		},
		async (request, reply) => {
			const { id } = request.params;

			const service = makeReopenEstablishmentService();
			const result = await service.handle({ establishmentId: id });

			return reply
				.status(HTTPStatusCodes.OK)
				.send(
					ApiResponse.success("Estabelecimento reaberto com sucesso", result)
				);
		}
	);
};
