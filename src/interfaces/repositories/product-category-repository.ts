import type { Prisma, ProductCategory } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";

export interface IProductCategoryRepository
	extends ICRUDBase<
		ProductCategory,
		Prisma.ProductCategoryCreateInput,
		Prisma.ProductCategoryUpdateInput,
		string
	> {}
