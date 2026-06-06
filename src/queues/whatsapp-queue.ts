import { createHash } from "node:crypto";

import { makeQueue } from "@/factories/services/queue/make-queue.js";
import type { SendWhatsappMessageJob } from "@/types/whatsapp.js";

export const whatsappQueueName = "whatsapp-queue";

const buildWhatsappJobId = (payload: SendWhatsappMessageJob): string => {
  const key = `${payload.establishmentId}:${payload.orderId ?? payload.recipientPhone}:${payload.orderStatus}`;

  return `send-whatsapp-${createHash("sha1").update(key).digest("hex")}`;
};

export const sendWhatsappMessageQueue = async (
  payload: SendWhatsappMessageJob,
) => {
  const queue = makeQueue<SendWhatsappMessageJob>(whatsappQueueName);

  await queue.enqueue("send-whatsapp-message", payload, {
    jobId: buildWhatsappJobId(payload),
  });
};
