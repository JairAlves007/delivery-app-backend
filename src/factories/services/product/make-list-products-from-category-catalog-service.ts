import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { ListProductsFromCategoryCatalogService } from "@/services/product/list-products-from-category-catalog-service.js";

export const makeListProductsFromCategoryCatalogService = () => {
  const productRepository = makeProductRepository();
  return new ListProductsFromCategoryCatalogService(productRepository);
};
