import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeCreateAddressService } from "@/factories/services/address/make-create-address-service.js";
import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import { createAddressBodySchema } from "@/schemas/address-schema.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { userIdSchema } from "@/schemas/generic-schema.js";

export const createAddressRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/",
		{
			schema: {
				operationId: "createAddress",
				tags: ["Addresses"],
				summary: "Criar um novo endereço",
				body: createAddressBodySchema,
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
				ensureUserHasPermission([PermissionType.MANAGE_OWN_ADDRESSES])
			]
		},
		async (request, reply) => {
			const userId = userIdSchema.parse(request.user.sub);
			const body = request.body;

			const createAddressService = makeCreateAddressService();

			await createAddressService.handle({
				userId,
				...body,
				paramsToForget: {
					user_id: userId
				}
			});

			return reply
				.status(HTTPStatusCodes.CREATED)
				.send(ApiResponse.success("Endereço criado com sucesso", {}));
		}
	);
};
