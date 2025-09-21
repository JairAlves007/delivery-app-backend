import type { Prisma, Product } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import { CursorPagination } from "../cursor-pagination.ts";

export interface IProductRepository
	extends ICRUDBase<
			Product,
			Prisma.ProductCreateInput,
			Prisma.ProductUpdateInput,
			string
		>,
		CursorPagination<Product, string> {
	getCatalog(
		establishmentId: string,
		limit: number,
		cursor?: string | null
	): Promise<Product[]>;

	deleteOldTags(id: string): Promise<void>;
}
