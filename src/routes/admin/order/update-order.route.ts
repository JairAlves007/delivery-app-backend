import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { makeUpdateOrderService } from "@/factories/services/order/make-update-order-service.js";
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
import {
	orderParamsSchema,
	updateOrderStatusBodySchema
} from "@/schemas/order-schema.js";

export const updateOrderRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().put(
		"/:id",
		{
			schema: {
				operationId: "updateOrder",
				tags: ["Orders"],
				summary: "Atualizar status do pedido",
				params: orderParamsSchema,
				body: updateOrderStatusBodySchema,
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
				ensureUserHasPermission([PermissionType.CANCEL_ORDERS])
			]
		},
		async (request, reply) => {
			const { id } = request.params;
			const body = request.body;

			const updateOrderService = makeUpdateOrderService();

			await updateOrderService.handle({
				id,
				...body,
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			});

			return reply
				.status(HTTPStatusCodes.NO_CONTENT)
				.send(ApiResponse.success("Pedido atualizado com sucesso", {}));
		}
	);
};
