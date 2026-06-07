import { createHash } from "node:crypto";

import { makeQueue } from "@/factories/services/queue/make-queue.js";
import type { CreateNotificationJob } from "@/types/notification.js";

export const notificationQueueName = "notification-queue";

const buildNotificationJobId = (payload: CreateNotificationJob): string => {
  const key = createHash("sha1")
    .update(
      [
        payload.type,
        payload.establishmentId,
        JSON.stringify(payload.metadata ?? {}),
      ].join(":"),
    )
    .digest("hex");

  return `create-notification-${key}`;
};

export const createNotificationQueue = async (
  payload: CreateNotificationJob,
) => {
  const queue = makeQueue<CreateNotificationJob>(notificationQueueName);

  await queue.enqueue("create-notification", payload, {
    jobId: buildNotificationJobId(payload),
  });
};
