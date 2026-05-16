import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { SearchProductsCatalogService } from "@/services/product/search-products-catalog-service.js";

export const makeSearchProductsCatalogService = () => {
  const productRepository = makeProductRepository();
  return new SearchProductsCatalogService(productRepository);
};
