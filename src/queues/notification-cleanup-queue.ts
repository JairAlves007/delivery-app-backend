import { makeQueue } from "@/factories/services/queue/make-queue.js";
import Constants from "@/helpers/constants.js";

export const notificationCleanupQueueName = "notification-cleanup-queue";

export const scheduleNotificationCleanup = async () => {
  const queue = makeQueue<Record<string, never>>(notificationCleanupQueueName);

  await queue.scheduleRepeatable(
    Constants.NOTIFICATION_CLEANUP_SCHEDULER_ID,
    Constants.NOTIFICATION_CLEANUP_CRON,
    { name: "cleanup-expired-notifications", data: {} },
  );
};
