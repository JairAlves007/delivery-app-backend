import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.js";
import { DeleteProductCategoryService } from "@/services/product/category/delete-product-category-service.js";

export const makeDeleteProductCategoryService = () => {
  const productCategoryRepository = makeProductCategoryRepository();
  return new DeleteProductCategoryService(productCategoryRepository);
};
