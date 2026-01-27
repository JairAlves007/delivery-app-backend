import { TypedEventEmitter } from "@/classes/event-emitter.ts";
import type { BuildOrderItemsParams } from "@/types/order.ts";

type SendOrderConfirmationMessageParams = {
	"send-order-confirmation-message": BuildOrderItemsParams;
};

export const sendOrderConfirmationMessageEvent =
	new TypedEventEmitter<SendOrderConfirmationMessageParams>();
