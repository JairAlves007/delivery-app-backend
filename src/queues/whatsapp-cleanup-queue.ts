import { makeQueue } from "@/factories/services/queue/make-queue.js";
import type { CleanupWhatsappInstanceJob } from "@/types/whatsapp.js";

export const whatsappCleanupQueueName = "whatsapp-cleanup-queue";

export const enqueueCleanupWhatsappInstance = async (
  payload: CleanupWhatsappInstanceJob,
) => {
  const queue = makeQueue<CleanupWhatsappInstanceJob>(whatsappCleanupQueueName);

  await queue.enqueue("cleanup-whatsapp-instance", payload, {
    jobId: `cleanup-whatsapp-${payload.establishmentId}`,
  });
};
