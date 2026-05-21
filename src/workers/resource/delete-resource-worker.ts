import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { env } from "@/env.js";
import { makeResourceRepository } from "@/factories/repositories/make-resource-repository.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { forgetCacheByForResource } from "@/helpers/resource.js";
import { app } from "@/http/app.js";
import { r2 } from "@/lib/cloudflare.js";
import {
  deleteResourceJobName,
  resourceQueueName,
} from "@/queues/resource-queue.js";
import type { DeleteResourceJobPayload } from "@/types/resource.js";

export const setupDeleteResourceWorker = () => {
  const resourceQueue = makeQueue<DeleteResourceJobPayload>(resourceQueueName);
  const resourceRepository = makeResourceRepository();

  resourceQueue.registerProcessor(async (payload) => {
    const { resourceId, bucketKey, forResources } = payload;

    app.log.info(
      { jobName: deleteResourceJobName, resourceId, bucketKey },
      "[Worker] Deleting resource from R2 + DB",
    );

    await r2.send(
      new DeleteObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Key: bucketKey,
      }),
    );

    await resourceRepository.deleteResource({ resourceId });

    await Promise.all(
      forResources.map((forResource) => forgetCacheByForResource(forResource)),
    );
  });
};
