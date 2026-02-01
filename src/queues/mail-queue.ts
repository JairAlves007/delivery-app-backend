import { makeQueue } from "@/factories/services/queue/make-queue.ts";
import type { SendResetPasswordMailEventType } from "@/types/mail.ts";
import type { BuildOrderItemsParams } from "@/types/order.ts";

export const mailQueueName = "mail-queue";

export const sendOrderConfirmationMessageQueue = async (
	payload: BuildOrderItemsParams
) => {
	const queue = makeQueue<BuildOrderItemsParams>(mailQueueName);

	queue.enqueue("send-order-confirmation-message", payload);
};

export const sendResetPasswordMailQueue = async (
	payload: SendResetPasswordMailEventType
) => {
	const queue = makeQueue<SendResetPasswordMailEventType>(mailQueueName);

	queue.enqueue("send-reset-password-mail", payload);
};
