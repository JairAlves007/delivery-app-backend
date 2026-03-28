import { makeCreateOrderService } from "@/factories/services/order/make-create-order-service.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { orderQueueName } from "@/queues/order-queue.js";
import type { CreateOrderParams } from "@/types/order.js";

export const setupCreateOrderWorker = () => {
	const orderQueue = makeQueue<CreateOrderParams>(orderQueueName);

	orderQueue.registerProcessor(async payload => {
		const createOrderService = makeCreateOrderService();

		try {
			await createOrderService.handle({ ...payload });
		} catch (error) {
			console.log("[Event] Error creating order:", error);
		}
	});
};
