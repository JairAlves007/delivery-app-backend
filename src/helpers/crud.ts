import { Prisma } from "@/generated/prisma/client.js";
import { searchAndOrderBySchema } from "@/schemas/generic-schema.js";
import type {
  FilterParams,
  SearchableModelFromRepositoryFields,
  ValidFilterParams,
} from "@/types/crud.js";

const DEFAULT_SIMILARITY_THRESHOLD = 0.3;

const FTS_CONFIG = "public.pt_unaccent";

const FTS_UNSUPPORTED_CHARS = /[^\p{L}\p{N}]+/gu;

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
  fuzzyFields,
  similarityThreshold,
}: {
  search: string;
  searchableFields: (keyof Field)[];
  fuzzyFields: (keyof Field)[];
  similarityThreshold?: number;
}): Prisma.Sql => {
  const threshold = similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;

  const substringFragments = searchableFields.map(
    (field) =>
      Prisma.sql`f_unaccent(${quoteIdentifier(String(field))}) ILIKE '%' || f_unaccent(${search}) || '%'`,
  );

  const fuzzyFragments = fuzzyFields.map(
    (field) =>
      Prisma.sql`strict_word_similarity(f_unaccent(${search}), f_unaccent(${quoteIdentifier(String(field))})) >= ${threshold}`,
  );

  return Prisma.sql`(${Prisma.join([...substringFragments, ...fuzzyFragments], " OR ")})`;
};

const buildUnaccentRankingSql = <Field>({
  search,
  fuzzyFields,
}: {
  search: string;
  fuzzyFields: (keyof Field)[];
}): Prisma.Sql => {
  const similarityCalls = fuzzyFields.map((field) => {
    const column = quoteIdentifier(String(field));
    return Prisma.sql`strict_word_similarity(f_unaccent(${search}), f_unaccent(${column}))`;
  });

  return Prisma.sql`GREATEST(${Prisma.join(similarityCalls, ", ")})`;
};

const ftsConfigSql = Prisma.raw(`'${FTS_CONFIG}'`);

const parseFtsTerms = (search: string): string[] =>
  search
    .normalize("NFC")
    .replace(FTS_UNSUPPORTED_CHARS, " ")
    .trim()
    .split(" ")
    .filter((term) => term.length > 0);

const buildFtsQueryExpression = (terms: string[]): string => {
  const prefixed = terms.map((term, index) =>
    index === terms.length - 1 ? `${term}:*` : term,
  );

  return prefixed.join(" & ");
};

const buildFtsVectorSql = <Field>(
  searchableFields: (keyof Field)[],
): Prisma.Sql => {
  const weighted = searchableFields.map((field, index) => {
    const column = `"${String(field).replace(/"/g, '""')}"`;
    const weight = index === 0 ? "A" : "B";

    return `setweight(to_tsvector('${FTS_CONFIG}', coalesce(${column}, '')), '${weight}')`;
  });

  return Prisma.raw(`(${weighted.join(" || ")})`);
};

export const buildHybridSearchSql = <Field>({
  search,
  searchableFields,
  fuzzyFields,
  similarityThreshold,
}: {
  search: string;
  searchableFields: (keyof Field)[];
  fuzzyFields: (keyof Field)[];
  similarityThreshold?: number;
}) => {
  const terms = parseFtsTerms(search);
  const hasFts = terms.length > 0 && searchableFields.length > 0;

  const vectorSql = hasFts
    ? buildFtsVectorSql<Field>(searchableFields)
    : undefined;

  const querySql = hasFts
    ? Prisma.sql`to_tsquery(${ftsConfigSql}, ${buildFtsQueryExpression(terms)})`
    : undefined;

  return {
    ftsWhereSql:
      vectorSql && querySql
        ? Prisma.sql`${vectorSql} @@ ${querySql}`
        : undefined,
    ftsRankSql:
      vectorSql && querySql
        ? Prisma.sql`ts_rank(${vectorSql}, ${querySql})`
        : undefined,
    fallbackWhereSql: buildUnaccentSearchSql<Field>({
      search,
      searchableFields,
      fuzzyFields,
      similarityThreshold,
    }),
    fallbackRankSql: buildUnaccentRankingSql<Field>({
      search,
      fuzzyFields,
    }),
  };
};

export function buildFilterQueryOptions<Field>({
  search,
  sortField,
  sortDirection,
  searchableFields,
  defaultSortField,
}: SearchableModelFromRepositoryFields<Field>) {
  const hasSearch = !!search && searchableFields.length > 0;

  const where = {
    ...(hasSearch && {
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

  return { where, orderBy };
}
