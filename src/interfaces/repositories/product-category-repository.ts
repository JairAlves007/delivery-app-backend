import type { Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import type { ProductCategoryFromRepository } from "@/types/product-category.ts";

export interface IProductCategoryRepository
	extends ICRUDBase<
		ProductCategoryFromRepository,
		Prisma.ProductCategoryCreateInput,
		Prisma.ProductCategoryUpdateInput,
		string
	> {}
