import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { ApiResponse } from "@/helpers/api.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import { logger, task } from "@trigger.dev/sdk";

export const forgetAllListingCacheKeysTaskId = "forget-all-listing-cache-keys";

export const forgetAllListingCacheKeysTask = task({
	id: forgetAllListingCacheKeysTaskId,
	queue: {
		name: forgetAllListingCacheKeysTaskId
	},
	onFailure: async () => {
		logger.log("Error forgetting all listing cache keys!");
	},
	run: async (
		{ baseCacheKey, paramsToForget }: ForgetAllListingCacheKeysParams,
		{ ctx }
	) => {
		logger.log("Forgetting all listing cache keys!", {
			baseCacheKey,
			paramsToForget,
			ctx
		});

		const cache = makeCache();
		await cache.forgetAllListingCacheKeys({ baseCacheKey, paramsToForget });

		return ApiResponse.success("Cache keys limpas com sucesso!", {});
	}
});
