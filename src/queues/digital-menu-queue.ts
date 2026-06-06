import { createHash } from "node:crypto";

import { makeQueue } from "@/factories/services/queue/make-queue.js";
import type { GenerateDigitalMenuJob } from "@/types/digital-menu.js";

export const digitalMenuQueueName = "digital-menu-queue";

const buildDigitalMenuJobId = (payload: GenerateDigitalMenuJob): string => {
  const key = createHash("sha1").update(payload.establishmentId).digest("hex");

  return `generate-digital-menu-${key}`;
};

export const enqueueGenerateDigitalMenu = async (
  payload: GenerateDigitalMenuJob,
) => {
  const queue = makeQueue<GenerateDigitalMenuJob>(digitalMenuQueueName);

  await queue.enqueue("generate-digital-menu", payload, {
    jobId: buildDigitalMenuJobId(payload),
  });
};
