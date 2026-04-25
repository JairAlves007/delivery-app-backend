import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.js";
import { CreateProductCategoryService } from "@/services/product/category/create-product-category-service.js";

export const makeCreateProductCategoryService = () => {
  const productCategoryRepository = makeProductCategoryRepository();
  return new CreateProductCategoryService(productCategoryRepository);
};
