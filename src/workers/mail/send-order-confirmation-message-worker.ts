import { makeSendOrderConfirmationMessageService } from "@/factories/services/order/make-send-order-confirmation-message.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { orderConfirmationQueueName } from "@/queues/mail-queue.js";
import type { BuildOrderItemsParams } from "@/types/order.js";

export const setupSendOrderConfirmationMessageWorker = async () => {
  const mailQueue = makeQueue<BuildOrderItemsParams>(
    orderConfirmationQueueName,
  );

  mailQueue.registerProcessor(async (payload) => {
    const sendOrderConfirmationMessageService =
      makeSendOrderConfirmationMessageService();

    try {
      await sendOrderConfirmationMessageService.handle({ ...payload });
    } catch (error) {
      console.log("[Worker] Error sending order confirmation message:", error);
    }
  });
};
