import { makeQueue } from "@/factories/services/queue/make-queue.js";
import type { SendWhatsAppMessageJob } from "@/types/whatsapp.js";

export const whatsAppQueueName = "whatsapp-queue";

const buildJobId = (payload: SendWhatsAppMessageJob): string => {
	const target = payload.orderId ?? payload.toPhone;
	return `wa-${payload.trigger}-${target}`;
};

export const enqueueWhatsAppMessage = async (
	payload: SendWhatsAppMessageJob
): Promise<void> => {
	const queue = makeQueue<SendWhatsAppMessageJob>(whatsAppQueueName);
	await queue.enqueue("send-whatsapp-message", payload, {
		jobId: buildJobId(payload)
	});
};
