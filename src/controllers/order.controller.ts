import { createOrderEvent } from "@/events/create-order-event.ts";
import { makeCancelOrderFromCustomerService } from "@/factories/services/order/make-cancel-order-from-customer-service.ts";
import { makeFindOrderService } from "@/factories/services/order/make-find-order-service.ts";
import { makeListMyOrdersService } from "@/factories/services/order/make-list-my-orders-service.ts";
import { makeListOrderService } from "@/factories/services/order/make-list-order-service.ts";
import { makeUpdateOrderService } from "@/factories/services/order/make-update-order-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	establishmentIdSchema,
	establishmentParamsSchema,
	listCursorQueryParamsSchema,
	listQueryParamsSchema,
	userIdSchema
} from "@/schemas/generic-schema.ts";
import {
	cancelOrderBodySchema,
	createOrderBodySchema,
	orderParamsSchema,
	updateOrderStatusBodySchema
} from "@/schemas/order-schema.ts";
import type { FilterParams } from "@/types/crud.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	const query = listQueryParamsSchema.parse(request.query);

	try {
		const listOrderService = makeListOrderService();

		const orders = await listOrderService.handle({
			...query,
			filterParams: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Pedidos listados com sucesso", orders));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const myOrders = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const query = listCursorQueryParamsSchema.parse(request.query);
	const { establishmentId } = establishmentParamsSchema.parse(request.params);

	const userId = userIdSchema.parse(request.user.sub);

	try {
		const listMyOrdersService = makeListMyOrdersService();

		const orders = await listMyOrdersService.handle({
			...query,
			filterParams: { user_id: userId, establishment_id: establishmentId }
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Meus pedidos listados com sucesso", orders));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const find = (isAdmin: boolean) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const { id } = orderParamsSchema.parse(request.params);
		const establishmentId = establishmentIdSchema.parse(
			request.user.primaryTenantId
		);
		const filterParams: FilterParams = {
			establishment_id: establishmentId
		};

		if (isAdmin) filterParams.user_id = userIdSchema.parse(request.user.sub);

		try {
			const findOrderService = makeFindOrderService();

			const order = await findOrderService.handle({
				id,
				filterParams
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Pedido encontrado com sucesso", order));
		} catch (error) {
			return reply.sendError(error);
		}
	};
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createOrderBodySchema.parse(request.body);
	const userId = userIdSchema.parse(request.user.sub);

	try {
		createOrderEvent.emit("create-task", {
			payload: {
				order: {
					...body,
					userId
				},
				paramsToForget: { establishment_id: request.user.primaryTenantId }
			}
		});

		return reply
			.status(HTTPStatusCodes.ACCEPTED)
			.send(
				ApiResponse.success(
					"Estamos processando seu pedido, em instantes você receberá uma notificação.",
					{}
				)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = orderParamsSchema.parse(request.params);
	const body = updateOrderStatusBodySchema.parse(request.body);

	try {
		const updateOrderService = makeUpdateOrderService();

		await updateOrderService.handle({
			id,
			...body,
			paramsToForget: { establishment_id: request.user.primaryTenantId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Pedido atualizado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const cancel = async (request: FastifyRequest, reply: FastifyReply) => {
	const { id } = orderParamsSchema.parse(request.params);
	const userId = userIdSchema.parse(request.user.sub);
	const { establishmentId } = cancelOrderBodySchema.parse(request.body);

	try {
		const cancelOrderService = makeCancelOrderFromCustomerService();

		await cancelOrderService.handle({
			id,
			filterParams: { establishment_id: establishmentId, user_id: userId }
		});

		return reply
			.status(HTTPStatusCodes.NO_CONTENT)
			.send(ApiResponse.success("Pedido cancelado com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
