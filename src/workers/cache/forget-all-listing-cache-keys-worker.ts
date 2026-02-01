import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { makeQueue } from "@/factories/services/queue/make-queue.ts";
import { cacheQueueName } from "@/queues/cache-queue.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";

export const setupForgetAllListingCacheKeysWorker = async () => {
	const cacheQueue = makeQueue<ForgetAllListingCacheKeysParams>(cacheQueueName);

	cacheQueue.registerProcessor(async payload => {
		const cache = makeCache();

		console.log("[Worker] Forgetting all listing cache keys...");

		try {
			await cache.forgetAllListingCacheKeys(payload);
		} catch (error) {
			console.log("[Worker] Error forgetting all listing cache keys:", error);
		}
	});
};
