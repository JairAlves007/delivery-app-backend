import z from "zod";

import { searchAndOrderBySchema } from "@/schemas/generic-schema.js";

import type { UserID } from "./user.js";

export type ValidFilterParams = {
	[K in keyof FilterParams]-?: Exclude<FilterParams[K], null | undefined>;
};

export type FilterField = {
	filterParams?: FilterParams;
};

export type FilterParams = z.infer<typeof searchAndOrderBySchema> & {
	establishment_id?: string | null;
	establishment_slug?: string | null;
	user_id?: UserID | null;
	category_id?: string | null;
};

export type SearchableModelFromRepositoryFields<Field> = Pick<
	Partial<ValidFilterParams>,
	"search" | "sortField" | "sortDirection"
> & {
	searchableFields: (keyof Field)[];
	defaultSortField: keyof Field;
};

export type PaginationParams = FilterField & {
	page: number;
	perPage: number;
};

export type FindByIdParams<Id> = FilterField & {
	id: Id;
};

export type UpdateContentParams<Id, UpdateData> = FindByIdParams<Id> & {
	data: UpdateData;
};

export type DeleteContentParams<Id> = FindByIdParams<Id> & {
	force: boolean;
};

export type CursorPaginationParams<CursorType> = FilterField & {
	limit: number;
	cursor?: CursorType | null;
};
