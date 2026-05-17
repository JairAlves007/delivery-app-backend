import type { Prisma } from "@/generated/prisma/client.js";
import type {
  ProductAddonCategoryFromRepository,
  ProductAddonCategoryWithProductFromRepository,
} from "@/types/product-addon-category.js";

export interface IProductAddonCategoryRepository {
  listByProductId(
    productId: string,
  ): Promise<ProductAddonCategoryFromRepository[]>;
  findByProductAndCategory(params: {
    productId: string;
    addonCategoryId: number;
  }): Promise<ProductAddonCategoryWithProductFromRepository | null>;
  findRequiredByProductId(productId: string): Promise<
    Array<{
      addon_category_id: number;
      min_selection: number | null;
    }>
  >;
  attach(data: Prisma.ProductAddonCategoryUncheckedCreateInput): Promise<void>;
  update(params: {
    id: number;
    data: Prisma.ProductAddonCategoryUpdateInput;
  }): Promise<void>;
  detach(params: { productId: string; addonCategoryId: number }): Promise<void>;
}
