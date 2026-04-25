import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.js";
import { ListProductCategoriesCatalogService } from "@/services/product/category/list-product-categories-catalog-service.js";

export const makeListProductCategoriesCatalogService = () => {
  const productCategoryRepository = makeProductCategoryRepository();
  return new ListProductCategoriesCatalogService(productCategoryRepository);
};
