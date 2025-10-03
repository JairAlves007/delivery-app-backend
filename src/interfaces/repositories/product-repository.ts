import type { Prisma, Product } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import { CursorPagination } from "../cursor-pagination.ts";
import { ProductFromRepository } from "@/types/product.ts";
import type { EstablishmentID } from "@/types/establishment.ts";

export interface IProductRepository
	extends ICRUDBase<
			ProductFromRepository,
			Prisma.ProductCreateInput,
			Prisma.ProductUpdateInput,
			string
		>,
		CursorPagination<ProductFromRepository, string> {
	getCatalog(
		establishmentId: EstablishmentID,
		limit: number,
		cursor?: string | null
	): Promise<ProductFromRepository[]>;

	deleteOldTags(id: string): Promise<void>;
}
