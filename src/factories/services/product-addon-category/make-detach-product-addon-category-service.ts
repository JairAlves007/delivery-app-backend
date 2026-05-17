import { makeProductAddonCategoryRepository } from "@/factories/repositories/make-product-addon-category-repository.js";
import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { DetachProductAddonCategoryService } from "@/services/product-addon-category/detach-product-addon-category-service.js";

export const makeDetachProductAddonCategoryService = () => {
  const productRepository = makeProductRepository();
  const productAddonCategoryRepository = makeProductAddonCategoryRepository();
  return new DetachProductAddonCategoryService(
    productRepository,
    productAddonCategoryRepository,
  );
};
