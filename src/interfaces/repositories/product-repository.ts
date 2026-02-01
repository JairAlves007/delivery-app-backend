import type { Prisma } from "@/generated/prisma/client.ts";
import { ProductFromRepository } from "@/types/product.ts";
import type { ICRUDBase } from "../crud-base.ts";
import { CursorPagination } from "../cursor-pagination.ts";

export interface IProductRepository
	extends
		ICRUDBase<
			ProductFromRepository,
			Prisma.ProductCreateInput,
			Prisma.ProductUpdateInput,
			string
		>,
		CursorPagination<ProductFromRepository, string> {
	deleteOldTags(id: string): Promise<void>;
}
