import type {
	FilterParams,
	SearchableModelFromRepositoryFields,
	ValidFilterParams
} from "@/types/crud.ts";

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

	return cacheKey.join("_") + "_";
};

export function buildFilterQueryOptions<Field>({
	search,
	sortField,
	sortOrder,
	searchableFields,
	defaultSortField
}: SearchableModelFromRepositoryFields<Field>) {
	const where = {
		...(search &&
			searchableFields.length > 0 && {
				OR: searchableFields.map(field => ({
					[field]: { contains: search, mode: "insensitive" }
				}))
			})
	};

	if (!sortField || !searchableFields.includes(sortField as keyof Field))
		sortField = defaultSortField as string;

	const orderBy = {
		[sortField]: sortOrder ?? "asc"
	};

	return { where, orderBy };
}
