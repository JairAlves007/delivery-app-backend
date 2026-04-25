import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { ListSuggestedProductsCatalogService } from "@/services/product/list-suggested-products-catalog-service.js";

export const makeListSuggestedProductsCatalogService = () => {
  const productRepository = makeProductRepository();
  return new ListSuggestedProductsCatalogService(productRepository);
};
