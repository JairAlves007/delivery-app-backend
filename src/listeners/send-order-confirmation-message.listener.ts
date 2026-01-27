import { sendOrderConfirmationMessageEvent } from "@/events/send-order-confirmation-message-event.ts";
import { makeSendOrderConfirmationMessageService } from "@/factories/services/order/make-send-order-confirmation-message.ts";
import type { BuildOrderItemsParams } from "@/types/order.ts";

sendOrderConfirmationMessageEvent.on(
	"send-order-confirmation-message",
	async (payload: BuildOrderItemsParams) => {
		console.log("[Event] Sending order confirmation message", payload);

		const sendOrderConfirmationMessageService =
			makeSendOrderConfirmationMessageService();

		try {
			await sendOrderConfirmationMessageService.handle({ ...payload });
		} catch (error) {
			console.log("[Event] Error sending order confirmation message:", error);
		}
	}
);
