import Constants from "@/helpers/constants.ts";
import { domainEvents } from "@/lib/domain-event.ts";
import {
	forgetAllListingCacheKeysTask,
	forgetAllListingCacheKeysTaskId
} from "@/tasks/forget-all-listing-cache-keys.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import { tasks } from "@trigger.dev/sdk";

domainEvents.on(
	Constants.EVENTS_KEYS.forgetAllListingCacheKeys,
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
