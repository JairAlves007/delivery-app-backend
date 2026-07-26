import { createHash } from "node:crypto";

import { makeQueue } from "@/factories/services/queue/make-queue.js";
import type {
  DeleteR2ObjectJobPayload,
  DeleteResourceJobPayload,
  ResourceJobPayload,
} from "@/types/resource.js";

export const resourceQueueName = "resource-queue";

const deleteResourceJobName = "delete-resource";
const deleteR2ObjectJobName = "delete-r2-object";

export const enqueueDeleteResource = async (
  payload: Omit<DeleteResourceJobPayload, "kind">,
): Promise<void> => {
  const queue = makeQueue<ResourceJobPayload>(resourceQueueName);

  await queue.enqueue(
    deleteResourceJobName,
    { kind: "delete-resource", ...payload },
    {
      jobId: `delete-resource-${payload.resourceId}`,
    },
  );
};

export const enqueueDeleteR2Object = async (
  payload: Omit<DeleteR2ObjectJobPayload, "kind">,
): Promise<void> => {
  const queue = makeQueue<ResourceJobPayload>(resourceQueueName);

  const keyHash = createHash("sha1").update(payload.bucketKey).digest("hex");

  await queue.enqueue(
    deleteR2ObjectJobName,
    { kind: "delete-r2-object", ...payload },
    {
      jobId: `delete-r2-object-${keyHash}`,
    },
  );
};
