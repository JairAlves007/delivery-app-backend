import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.js";
import { UpdateProductCategoryService } from "@/services/product/category/update-product-category-service.js";

export const makeUpdateProductCategoryService = () => {
  const productCategoryRepository = makeProductCategoryRepository();
  return new UpdateProductCategoryService(productCategoryRepository);
};
