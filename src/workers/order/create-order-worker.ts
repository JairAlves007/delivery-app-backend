import { makeCreateOrderService } from "@/factories/services/order/make-create-order-service.ts";
import { makeQueue } from "@/factories/services/queue/make-queue.ts";
import { orderQueueName } from "@/queues/order-queue.ts";
import type { CreateOrderParams } from "@/types/order.ts";

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
