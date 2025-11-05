import Constants from "@/helpers/constants.ts";
import type { FilterParams } from "./crud.ts";

export type CacheKeys = keyof typeof Constants.CACHE_KEYS;

export type ForgetAllListingCacheKeysParams = {
	baseCacheKey: CacheKeys;
	paramsToClean?: FilterParams;
};
