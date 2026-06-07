import { makeCreateNotificationService } from "@/factories/services/notification/make-create-notification-service.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { notificationQueueName } from "@/queues/notification-queue.js";
import type { CreateNotificationJob } from "@/types/notification.js";

export const setupCreateNotificationWorker = () => {
  const notificationQueue = makeQueue<CreateNotificationJob>(
    notificationQueueName,
  );

  notificationQueue.registerProcessor(async (payload) => {
    const createNotificationService = makeCreateNotificationService();

    await createNotificationService.handle(payload);
  });
};
