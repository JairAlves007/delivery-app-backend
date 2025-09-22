import { CursorPaginationParams } from "@/types/crud.ts";

export interface CursorPagination<Model, CursorType> {
	cursorPaginate(
		cursorPaginationParams: CursorPaginationParams<CursorType>
	): Promise<Model[]>;
}
