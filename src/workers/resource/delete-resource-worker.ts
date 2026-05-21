import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { env } from "@/env.js";
import { makeResourceRepository } from "@/factories/repositories/make-resource-repository.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { forgetCacheByForResource } from "@/helpers/resource.js";
import { app } from "@/http/app.js";
import { r2 } from "@/lib/cloudflare.js";
import { resourceQueueName } from "@/queues/resource-queue.js";
import type { ResourceJobPayload } from "@/types/resource.js";

export const setupDeleteResourceWorker = () => {
  const resourceQueue = makeQueue<ResourceJobPayload>(resourceQueueName);
  const resourceRepository = makeResourceRepository();

  const deleteR2Object = async (bucketKey: string): Promise<void> => {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Key: bucketKey,
      }),
    );
  };

  resourceQueue.registerProcessor(async (payload) => {
    switch (payload.kind) {
      case "delete-resource": {
        const { resourceId, bucketKey, forResources } = payload;

        app.log.info(
          { kind: payload.kind, resourceId, bucketKey },
          "[Worker] Deleting resource from R2 + DB",
        );

        await deleteR2Object(bucketKey);
        await resourceRepository.deleteResource({ resourceId });
        await Promise.all(
          forResources.map((forResource) =>
            forgetCacheByForResource(forResource),
          ),
        );
        return;
      }

      case "delete-r2-object": {
        const { bucketKey } = payload;

        app.log.info(
          { kind: payload.kind, bucketKey },
          "[Worker] Deleting R2 object (DB row preserved)",
        );

        await deleteR2Object(bucketKey);
        return;
      }
    }
  });
};
