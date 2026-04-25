import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { ListProductService } from "@/services/product/list-product-service.js";

export const makeListProductService = () => {
  const productRepository = makeProductRepository();
  return new ListProductService(productRepository);
};
