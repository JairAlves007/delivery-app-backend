import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { ApiResponse } from "@/helpers/api.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import { logger, task } from "@trigger.dev/sdk";

export const forgetAllListingCacheKeysTaskId = "forget-all-listing-cache-keys";

export const forgetAllListingCacheKeysTaskTask = task({
	id: forgetAllListingCacheKeysTaskId,
	queue: {
		name: forgetAllListingCacheKeysTaskId
	},
	onFailure: async () => {
		logger.log("Error forgetting all listing cache keys!");
	},
	run: async (
		{ baseCacheKey, paramsToClean }: ForgetAllListingCacheKeysParams,
		{ ctx }
	) => {
		logger.log("Forgetting all listing cache keys!", {
			baseCacheKey,
			paramsToClean,
			ctx
		});

		const cache = makeCache();
		await cache.forgetAllListingCacheKeys({ baseCacheKey, paramsToClean });

		return ApiResponse.success("Cache keys limpas com sucesso!", {});
	}
});
