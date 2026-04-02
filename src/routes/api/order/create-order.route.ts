import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { PermissionType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { ensureUserHasPermission } from "@/middlewares/ensure-user-has-permission.js";
import { isAuthenticated } from "@/middlewares/is-auth.js";
import { createOrderQueue } from "@/queues/order-queue.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { userIdSchema } from "@/schemas/generic-schema.js";
import { createOrderBodySchema } from "@/schemas/order-schema.js";

export const createOrderRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/",
		{
			schema: {
				operationId: "createOrder",
				tags: ["Orders"],
				summary: "Criar um pedido",
				body: createOrderBodySchema,
				response: {
					202: apiSuccessResponseSchema(z.object({})),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			},
			onRequest: [
				isAuthenticated,
				ensureUserHasPermission([PermissionType.MANAGE_OWN_ORDERS])
			]
		},
		async (request, reply) => {
			const body = request.body;
			const userId = userIdSchema.parse(request.user.sub);

			await createOrderQueue({
				order: {
					...body,
					userId
				},
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.ACCEPTED)
				.send(
					ApiResponse.success(
						"Estamos processando seu pedido, em instantes você receberá uma notificação.",
						{}
					)
				);
		}
	);
};
