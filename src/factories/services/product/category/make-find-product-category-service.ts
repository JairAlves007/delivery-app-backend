import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.js";
import { FindProductCategoryService } from "@/services/product/category/find-product-category-service.js";

export const makeFindProductCategoryService = () => {
  const productCategoryRepository = makeProductCategoryRepository();
  return new FindProductCategoryService(productCategoryRepository);
};
