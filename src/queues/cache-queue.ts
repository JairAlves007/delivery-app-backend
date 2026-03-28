import { makeQueue } from "@/factories/services/queue/make-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

export const cacheQueueName = "cache-queue";

export const forgetAllListingCacheKeysQueue = async (
	payload: ForgetAllListingCacheKeysParams
) => {
	console.log("Add forgetAllListingCacheKeys to queue...");
	const queue = makeQueue<ForgetAllListingCacheKeysParams>(cacheQueueName);

	await queue.enqueue("forget-all-listing-cache-keys", payload);
};
