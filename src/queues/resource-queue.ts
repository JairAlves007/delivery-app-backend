import { makeQueue } from "@/factories/services/queue/make-queue.js";
import type { DeleteResourceJobPayload } from "@/types/resource.js";

export const resourceQueueName = "resource-queue";

export const deleteResourceJobName = "delete-resource";

export const enqueueDeleteResource = async (
  payload: DeleteResourceJobPayload,
): Promise<void> => {
  const queue = makeQueue<DeleteResourceJobPayload>(resourceQueueName);

  await queue.enqueue(deleteResourceJobName, payload, {
    jobId: `delete-resource-${payload.resourceId}`,
  });
};
