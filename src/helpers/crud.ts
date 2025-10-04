import type { FilterParams, ValidFilterParams } from "@/types/crud.ts";

export const transformValidFilterParams = (
	filterParams?: FilterParams
): Partial<ValidFilterParams> => {
	return Object.fromEntries(
		Object.entries(filterParams || {}).filter(
			([_, v]) => v !== null && v !== undefined
		)
	);
};

export const getFilterParamsCacheKey = (
	filterParams?: FilterParams
): string => {
	const params = transformValidFilterParams(filterParams);
	const cacheKey: string[] = [];

	Object.entries(params).forEach(([key, value]) => {
		cacheKey.push(key, value);
	});

	return cacheKey.join("_");
};
