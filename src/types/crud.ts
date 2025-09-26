import type { UserID } from "./user.ts";

export type ValidFilterParams = {
	[K in keyof FilterParams]-?: Exclude<FilterParams[K], null | undefined>;
};

export type FilterParams = {
	establishment_id?: string | null;
	user_id?: UserID | null;
};

export type PaginationParams = {
	page: number;
	perPage: number;
	filterParams?: FilterParams;
};

export type FindByIdParams<Id> = {
	id: Id;
	filterParams?: FilterParams;
};

export type UpdateContentParams<Id, UpdateData> = FindByIdParams<Id> & {
	data: UpdateData;
};

export type DeleteContentParams<Id> = FindByIdParams<Id> & {
	force: boolean;
};

export type CursorPaginationParams<CursorType> = {
	limit: number;
	cursor?: CursorType | null;
	filterParams?: FilterParams;
};
