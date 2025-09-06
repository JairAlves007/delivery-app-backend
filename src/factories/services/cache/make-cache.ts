import { Cache } from "@/helpers/cache.ts";

export const makeCache = () => {
	return Cache.getInstance();
};
