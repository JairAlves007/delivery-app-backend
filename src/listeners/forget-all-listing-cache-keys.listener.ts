import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import {
	forgetAllListingCacheKeysTask,
	forgetAllListingCacheKeysTaskId
} from "@/tasks/forget-all-listing-cache-keys.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import { tasks } from "@trigger.dev/sdk";

forgetAllListingCacheKeysEvent.on(
	"forget-all-listing-cache-keys",
	async ({ baseCacheKey, paramsToForget }: ForgetAllListingCacheKeysParams) => {
		console.log(
			`[Event] Forgetting all listing cache keys: ${baseCacheKey} to ${paramsToForget}`
		);

		await tasks.trigger<typeof forgetAllListingCacheKeysTask>(
			forgetAllListingCacheKeysTaskId,
			{
				baseCacheKey,
				paramsToForget
			}
		);
	}
);
