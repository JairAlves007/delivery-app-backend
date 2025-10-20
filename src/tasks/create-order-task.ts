import { makeCreateOrderService } from "@/factories/services/order/make-create-order-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import type { OrderIntent } from "@/types/order.ts";
import { logger, task } from "@trigger.dev/sdk";

export const createOrderTaskId = "create-order";

export const createOrderTask = task({
	id: createOrderTaskId,
	queue: {
		name: createOrderTaskId
	},
	onFailure: async () => {
		logger.log("Error creating order!");
	},
	run: async (payload: OrderIntent, { ctx }) => {
		logger.log("Creating order!", { payload, ctx });

		const createOrderService = makeCreateOrderService();

		await createOrderService.handle({ ...payload });

		return ApiResponse.success("Pedido criado com sucesso!", {});
	}
});
