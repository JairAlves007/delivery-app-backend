import type { ProductCategoryFromRepository } from "@/types/product-category.ts";
import type { Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import type { CursorPagination } from "../cursor-pagination.ts";

export interface IProductCategoryRepository
	extends ICRUDBase<
			ProductCategoryFromRepository,
			Prisma.ProductCategoryCreateInput,
			Prisma.ProductCategoryUpdateInput,
			string
		>,
		CursorPagination<ProductCategoryFromRepository, string> {}
