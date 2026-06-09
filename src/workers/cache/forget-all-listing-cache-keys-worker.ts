import { makeCache } from "@/factories/services/cache/make-cache.js";
import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { app } from "@/http/app.js";
import { cacheQueueName } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

export const setupForgetAllListingCacheKeysWorker = async () => {
  const cacheQueue = makeQueue<ForgetAllListingCacheKeysParams>(cacheQueueName);

  cacheQueue.registerProcessor(async (payload) => {
    const cache = makeCache();

    app.log.info("[Worker] Forgetting all listing cache keys...");

    await cache.forgetAllListingCacheKeys(payload);
  });
};
