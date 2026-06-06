import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { makeSendOrderStatusMessageService } from "@/factories/services/whatsapp/make-send-order-status-message-service.js";
import { whatsappQueueName } from "@/queues/whatsapp-queue.js";
import type { SendWhatsappMessageJob } from "@/types/whatsapp.js";

export const setupSendWhatsappMessageWorker = () => {
  const whatsappQueue = makeQueue<SendWhatsappMessageJob>(whatsappQueueName);

  whatsappQueue.registerProcessor(async (payload) => {
    const sendOrderStatusMessageService = makeSendOrderStatusMessageService();
    await sendOrderStatusMessageService.handle(payload);
  });
};
