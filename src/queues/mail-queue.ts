import { makeQueue } from "@/factories/services/queue/make-queue.js";
import type { SendResetPasswordMailEventType } from "@/types/mail.js";
import type { BuildOrderItemsParams } from "@/types/order.js";

export const mailQueueName = "mail-queue";
export const orderConfirmationQueueName = "order-confirmation-queue";

export const sendOrderConfirmationMessageQueue = async (
	payload: BuildOrderItemsParams
) => {
	const queue = makeQueue<BuildOrderItemsParams>(orderConfirmationQueueName);

	queue.enqueue("send-order-confirmation-message", payload);
};

export const sendResetPasswordMailQueue = async (
	payload: SendResetPasswordMailEventType
) => {
	const queue = makeQueue<SendResetPasswordMailEventType>(mailQueueName);

	queue.enqueue("send-reset-password-mail", payload);
};
