import type { Prisma, Product } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import { CursorPagination } from "../cursor-pagination.ts";
import { ProductFromRepository } from "@/types/product.ts";

export interface IProductRepository
	extends ICRUDBase<
			ProductFromRepository,
			Prisma.ProductCreateInput,
			Prisma.ProductUpdateInput,
			string
		>,
		CursorPagination<ProductFromRepository, string> {
	getCatalog(
		establishmentId: string,
		limit: number,
		cursor?: string | null
	): Promise<ProductFromRepository[]>;

	deleteOldTags(id: string): Promise<void>;
}
