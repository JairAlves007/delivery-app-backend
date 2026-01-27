import { createOrderEvent } from "@/events/create-order-event.ts";
import { makeCreateOrderService } from "@/factories/services/order/make-create-order-service.ts";
import type { CreateOrderEventType } from "@/types/order.ts";

createOrderEvent.on(
	"create-task",
	async ({ payload }: CreateOrderEventType) => {
		const createOrderService = makeCreateOrderService();

		await createOrderService.handle({ ...payload });
	}
);
