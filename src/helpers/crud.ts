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
