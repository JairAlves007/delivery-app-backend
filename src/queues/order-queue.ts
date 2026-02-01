import { makeQueue } from "@/factories/services/queue/make-queue.ts";
import type { CreateOrderParams } from "@/types/order.ts";

export const orderQueueName = "order-queue";

export const createOrderQueue = async (payload: CreateOrderParams) => {
	const queue = makeQueue<CreateOrderParams>(orderQueueName);

	await queue.enqueue("create-order", payload);
};
