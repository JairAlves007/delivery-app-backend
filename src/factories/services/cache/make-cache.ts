import { Cache } from "@/classes/cache.ts";

export const makeCache = () => {
	return Cache.getInstance();
};
