import { Prisma } from "@/generated/prisma/client.js";
import { searchAndOrderBySchema } from "@/schemas/generic-schema.js";
import type {
  FilterParams,
  SearchableModelFromRepositoryFields,
  ValidFilterParams,
} from "@/types/crud.js";

const DEFAULT_SIMILARITY_THRESHOLD = 0.2;

export const transformValidFilterParams = (
  filterParams?: FilterParams,
): Partial<ValidFilterParams> => {
  return Object.fromEntries(
    Object.entries(filterParams || {}).filter(
      ([, v]) => v !== null && v !== undefined,
    ),
  );
};

export const getFilterParamsCacheKey = (
  filterParams?: FilterParams,
): string => {
  const params = transformValidFilterParams(filterParams);
  if (!params || Object.keys(params).length === 0) return "";

  const primaryKeys: (keyof FilterParams)[] =
    searchAndOrderBySchema.keyof().options;

  const orderedEntries = [
    ...primaryKeys.map((key) => [key, params[key]] as const),
    ...Object.entries(params)
      .filter(([key]) => !primaryKeys.includes(key as keyof FilterParams))
      .sort(([a], [b]) => a.localeCompare(b)),
  ];

  const validEntries = orderedEntries.filter(
    ([, value]) => !!value && value.trim().length > 0,
  );

  return validEntries.map(([key, value]) => `${key}_${value}`).join("_") + "_";
};

const quoteIdentifier = (field: string): Prisma.Sql =>
  Prisma.raw(`"${field.replace(/"/g, '""')}"`);

const buildUnaccentSearchSql = <Field>({
  search,
  searchableFields,
  similarityThreshold,
}: {
  search: string;
  searchableFields: (keyof Field)[];
  similarityThreshold?: number;
}): Prisma.Sql => {
  const threshold = similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;

  const fragments = searchableFields.flatMap((field) => {
    const column = quoteIdentifier(String(field));
    return [
      Prisma.sql`f_unaccent(${column}) ILIKE '%' || f_unaccent(${search}) || '%'`,
      Prisma.sql`similarity(f_unaccent(${column}), f_unaccent(${search})) >= ${threshold}`,
    ];
  });

  return Prisma.sql`(${Prisma.join(fragments, " OR ")})`;
};

const buildUnaccentRankingSql = <Field>({
  search,
  searchableFields,
}: {
  search: string;
  searchableFields: (keyof Field)[];
}): Prisma.Sql => {
  const similarityCalls = searchableFields.map((field) => {
    const column = quoteIdentifier(String(field));
    return Prisma.sql`similarity(f_unaccent(${column}), f_unaccent(${search}))`;
  });

  return Prisma.sql`GREATEST(${Prisma.join(similarityCalls, ", ")})`;
};

export function buildFilterQueryOptions<Field>({
  search,
  sortField,
  sortDirection,
  searchableFields,
  defaultSortField,
  useUnaccent,
  similarityThreshold,
}: SearchableModelFromRepositoryFields<Field>) {
  const hasSearch = !!search && searchableFields.length > 0;

  const where = {
    ...(hasSearch &&
      !useUnaccent && {
        OR: searchableFields.map((field) => ({
          [field]: { contains: search, mode: "insensitive" },
        })),
      }),
  };

  if (!sortField || !searchableFields.includes(sortField as keyof Field))
    sortField = defaultSortField as string;

  const orderBy = {
    [sortField]: sortDirection ?? "asc",
  };

  const searchSql =
    hasSearch && useUnaccent
      ? buildUnaccentSearchSql<Field>({
          search,
          searchableFields,
          similarityThreshold,
        })
      : undefined;

  const rankingSql =
    hasSearch && useUnaccent
      ? buildUnaccentRankingSql<Field>({ search, searchableFields })
      : undefined;

  return { where, orderBy, searchSql, rankingSql };
}
