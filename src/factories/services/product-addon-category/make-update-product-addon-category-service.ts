import { makeProductAddonCategoryRepository } from "@/factories/repositories/make-product-addon-category-repository.js";
import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { UpdateProductAddonCategoryService } from "@/services/product-addon-category/update-product-addon-category-service.js";

export const makeUpdateProductAddonCategoryService = () => {
  const productRepository = makeProductRepository();
  const productAddonCategoryRepository = makeProductAddonCategoryRepository();
  return new UpdateProductAddonCategoryService(
    productRepository,
    productAddonCategoryRepository,
  );
};
