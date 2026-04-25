import type { Prisma } from "@/generated/prisma/client.js";
import type { ProductCategoryFromRepository } from "@/types/product-category.js";

import type { ICRUDBase } from "../crud-base.js";
import type { CursorPagination } from "../cursor-pagination.js";

export interface IProductCategoryRepository
  extends
    ICRUDBase<
      ProductCategoryFromRepository,
      Prisma.ProductCategoryCreateInput,
      Prisma.ProductCategoryUpdateInput,
      string
    >,
    CursorPagination<ProductCategoryFromRepository, string> {}
