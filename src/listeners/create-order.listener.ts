import { createOrderEvent } from "@/events/create-order-event.ts";
import { makeCreateOrderService } from "@/factories/services/order/make-create-order-service.ts";
import type { CreateOrderEventType } from "@/types/order.ts";

createOrderEvent.on(
	"create-order",
	async ({ payload }: CreateOrderEventType) => {
		const createOrderService = makeCreateOrderService();

		try {
			await createOrderService.handle({ ...payload });
		} catch (error) {
			console.log("[Event] Error creating order:", error);
		}
	}
);
