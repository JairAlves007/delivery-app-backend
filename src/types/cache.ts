import Constants from "@/helpers/constants.js";

import type { FilterParams } from "./crud.js";

export type CacheKeys = keyof typeof Constants.CACHE_KEYS;

export type ForgetAllListingCacheKeysParams = {
  baseCacheKey: CacheKeys;
  paramsToForget?: FilterParams;
};
