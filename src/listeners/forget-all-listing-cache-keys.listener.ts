import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";

forgetAllListingCacheKeysEvent.on(
	"forget-all-listing-cache-keys",
	async ({ baseCacheKey, paramsToForget }: ForgetAllListingCacheKeysParams) => {
		console.log(
			`[Event] Forgetting all listing cache keys: ${baseCacheKey} to ${paramsToForget}`
		);

		const cache = makeCache();
		await cache.forgetAllListingCacheKeys({ baseCacheKey, paramsToForget });
	}
);
