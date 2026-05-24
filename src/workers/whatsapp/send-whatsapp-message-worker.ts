import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { makeSendWhatsAppMessageService } from "@/factories/services/whatsapp/make-send-whatsapp-message-service.js";
import { whatsAppQueueName } from "@/queues/whatsapp-queue.js";
import type { SendWhatsAppMessageJob } from "@/types/whatsapp.js";

export const setupSendWhatsAppMessageWorker = () => {
	const queue = makeQueue<SendWhatsAppMessageJob>(whatsAppQueueName);

	queue.registerProcessor(async payload => {
		const service = makeSendWhatsAppMessageService();
		await service.handle(payload);
	});
};
