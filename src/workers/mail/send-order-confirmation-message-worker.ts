import { makeSendOrderConfirmationMessageService } from "@/factories/services/order/make-send-order-confirmation-message.ts";
import { makeQueue } from "@/factories/services/queue/make-queue.ts";
import { mailQueueName } from "@/queues/mail-queue.ts";
import type { BuildOrderItemsParams } from "@/types/order.ts";

export const setupSendOrderConfirmationMessageWorker = async () => {
	const mailQueue = makeQueue<BuildOrderItemsParams>(mailQueueName);

	mailQueue.registerProcessor(async payload => {
		const sendOrderConfirmationMessageService =
			makeSendOrderConfirmationMessageService();

		try {
			await sendOrderConfirmationMessageService.handle({ ...payload });
		} catch (error) {
			console.log("[Worker] Error sending order confirmation message:", error);
		}
	});
};
