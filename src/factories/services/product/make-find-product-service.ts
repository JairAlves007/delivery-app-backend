import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.js";
import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { FindProductService } from "@/services/product/find-product-service.js";

export const makeFindProductService = () => {
  const productRepository = makeProductRepository();
  const addonCategoryRepository = makeAddonCategoryRepository();
  return new FindProductService(productRepository, addonCategoryRepository);
};
