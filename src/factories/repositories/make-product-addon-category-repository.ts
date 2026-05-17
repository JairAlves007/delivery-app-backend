import { ProductAddonCategoryPrismaRepository } from "@/repositories/product-addon-category-prisma-repository.js";

export const makeProductAddonCategoryRepository = () => {
  return new ProductAddonCategoryPrismaRepository();
};
