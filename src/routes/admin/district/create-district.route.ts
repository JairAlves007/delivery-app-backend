import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeCreateDistrictService } from "@/factories/services/district/make-create-district-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { createDistrictBodySchema } from "@/schemas/district-schema.js";

export const createDistrictRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/",
		{
			schema: {
				tags: ["Districts"],
				summary: "Criar bairro",
				body: createDistrictBodySchema,
				response: {
					201: apiSuccessResponseSchema(z.object({})),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					409: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_DISTRICTS])
			]
		},
		async (request, reply) => {
			const body = request.body;

			const createDistrictService = makeCreateDistrictService();

			await createDistrictService.handle({
				...body,
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.CREATED)
				.send(ApiResponse.success("Bairro criado com sucesso", {}));
		}
	);
};
