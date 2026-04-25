import { CursorPaginationParams } from "@/types/crud.js";

export interface CursorPagination<Model, CursorType> {
  cursorPaginate(
    cursorPaginationParams: CursorPaginationParams<CursorType>,
  ): Promise<Model[]>;
}
