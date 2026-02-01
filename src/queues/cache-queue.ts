import { makeQueue } from "@/factories/services/queue/make-queue.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";

export const cacheQueueName = "cache-queue";

export const forgetAllListingCacheKeysQueue = async (
	payload: ForgetAllListingCacheKeysParams
) => {
	console.log("Add forgetAllListingCacheKeys to queue...");
	const queue = makeQueue<ForgetAllListingCacheKeysParams>(cacheQueueName);

	await queue.enqueue("forget-all-listing-cache-keys", payload);
};
