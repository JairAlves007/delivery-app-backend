import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeCreateEstablishmentOwnerService } from "@/factories/services/establishment-owner/make-create-establishment-owner-service.js";
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
import { createEstablishmentOwnerBodySchema } from "@/schemas/establishment-owner-schema.js";

export const createEstablishmentOwnerRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/",
		{
			schema: {
				operationId: "createEstablishmentOwner",
				tags: adminTags("Establishment Owners"),
				summary: "Criar dono de estabelecimento",
				body: createEstablishmentOwnerBodySchema,
				response: {
					201: apiSuccessResponseSchema(z.object({})),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					404: apiDefaultErrorResponseSchema,
					409: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_ESTABLISHMENT_OWNERS])
			]
		},
		async (request, reply) => {
			const body = request.body;

			const service = makeCreateEstablishmentOwnerService();
			await service.handle({ ...body, paramsToForget: {} });

			return reply
				.status(HTTPStatusCodes.CREATED)
				.send(
					ApiResponse.success("Dono de estabelecimento criado com sucesso", {})
				);
		}
	);
};
