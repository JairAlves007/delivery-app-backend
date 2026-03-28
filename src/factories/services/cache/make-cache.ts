import { Cache } from "@/classes/cache.js";

export const makeCache = () => {
	return Cache.getInstance();
};
