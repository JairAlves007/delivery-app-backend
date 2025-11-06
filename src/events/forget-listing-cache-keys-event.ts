import { TypedEventEmitter } from "@/classes/event-emitter.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";

type ForgetAllListingCacheKeysEventType = {
	"forget-all-listing-cache-keys": ForgetAllListingCacheKeysParams;
};

export const forgetAllListingCacheKeysEvent =
	new TypedEventEmitter<ForgetAllListingCacheKeysEventType>();
