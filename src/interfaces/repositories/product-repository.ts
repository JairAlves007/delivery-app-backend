import type { Prisma } from "@/generated/prisma/client.js";
import { ProductFromRepository } from "@/types/product.js";

import type { ICRUDBase } from "../crud-base.js";
import { CursorPagination } from "../cursor-pagination.js";

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
	findSuggested(params: {
		productId: string;
		establishmentId: string;
		limit: number;
	}): Promise<ProductFromRepository[]>;
}
