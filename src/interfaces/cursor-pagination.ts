export interface CursorPagination<Model, CursorType> {
	cursorPaginate(
		limit: number,
		cursor?: CursorType | null,
		filterId?: string | null
	): Promise<Model[]>;
}
