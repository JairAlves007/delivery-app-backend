import { TypedEventEmitter } from "@/classes/event-emitter.ts";
import type { CreateOrderEventType } from "@/types/order.ts";

type CreateOrderParams = {
	"create-order": CreateOrderEventType;
};

export const createOrderEvent = new TypedEventEmitter<CreateOrderParams>();
