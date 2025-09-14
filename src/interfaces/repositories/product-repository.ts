import type { Prisma, Product } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";

export interface IProductRepository
	extends ICRUDBase<
		Product,
		Prisma.ProductCreateInput,
		Prisma.ProductUpdateInput,
		string
	> {
	getCatalog(
		establishmentId: string,
		limit: number,
		cursor?: string | null
	): Promise<Product[]>;
}
