import { makeProductAddonCategoryRepository } from "@/factories/repositories/make-product-addon-category-repository.js";
import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { ListProductAddonCategoriesService } from "@/services/product-addon-category/list-product-addon-categories-service.js";

export const makeListProductAddonCategoriesService = () => {
  const productRepository = makeProductRepository();
  const productAddonCategoryRepository = makeProductAddonCategoryRepository();
  return new ListProductAddonCategoriesService(
    productRepository,
    productAddonCategoryRepository,
  );
};
