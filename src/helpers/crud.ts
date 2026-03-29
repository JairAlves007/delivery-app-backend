import { searchAndOrderBySchema } from "@/schemas/generic-schema.js";
import type {
	FilterParams,
	SearchableModelFromRepositoryFields,
	ValidFilterParams
} from "@/types/crud.js";

export const transformValidFilterParams = (
	filterParams?: FilterParams
): Partial<ValidFilterParams> => {
	return Object.fromEntries(
		Object.entries(filterParams || {}).filter(
			([, v]) => v !== null && v !== undefined
		)
	);
};

export const getFilterParamsCacheKey = (
	filterParams?: FilterParams
): string => {
	const params = transformValidFilterParams(filterParams);
	if (!params || Object.keys(params).length === 0) return "";

	const primaryKeys: (keyof FilterParams)[] =
		searchAndOrderBySchema.keyof().options;

	const orderedEntries = [
		...primaryKeys.map(key => [key, params[key]] as const),
		...Object.entries(params).filter(
			([key]) => !primaryKeys.includes(key as keyof FilterParams)
		)
	];

	const validEntries = orderedEntries.filter(
		([, value]) => !!value && value.trim().length > 0
	);

	return validEntries.map(([key, value]) => `${key}_${value}`).join("_") + "_";
};

export function buildFilterQueryOptions<Field>({
	search,
	sortField,
	sortDirection,
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
		[sortField]: sortDirection ?? "asc"
	};

	return { where, orderBy };
}
