import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { makeListMyOrdersService } from "@/factories/services/order/make-list-my-orders-service.js";
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
	establishmentParamsSchema,
	listCursorQueryParamsSchema,
	userIdSchema
} from "@/schemas/generic-schema.js";
import { myOrdersResponseSchema } from "@/schemas/response-schema.js";

export const myOrdersRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/my",
		{
			schema: {
				operationId: "myOrders",
				tags: ["Orders"],
				summary: "Listar meus pedidos",
				params: establishmentParamsSchema,
				querystring: listCursorQueryParamsSchema,
				response: {
					200: apiSuccessResponseSchema(myOrdersResponseSchema),
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
			const query = request.query;
			const { establishmentId } = request.params;
			const userId = userIdSchema.parse(request.user.sub);

			const listMyOrdersService = makeListMyOrdersService();

			const orders = await listMyOrdersService.handle({
				...query,
				filterParams: { user_id: userId, establishment_id: establishmentId }
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Meus pedidos listados com sucesso", orders));
		}
	);
};
