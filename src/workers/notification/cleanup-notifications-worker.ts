import { makeNotificationRepository } from "@/factories/repositories/make-notification-repository.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { app } from "@/http/app.js";
import { notificationCleanupQueueName } from "@/queues/notification-cleanup-queue.js";

export const setupCleanupNotificationsWorker = () => {
  const cleanupQueue = makeQueue<Record<string, never>>(
    notificationCleanupQueueName,
  );

  cleanupQueue.registerProcessor(async () => {
    const notificationRepository = makeNotificationRepository();
    const deletedCount = await notificationRepository.deleteExpired();

    app.log.info(
      { deletedCount },
      "[Notification] expired notifications cleanup finished",
    );
  });
};
