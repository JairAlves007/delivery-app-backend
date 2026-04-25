import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { FindProductService } from "@/services/product/find-product-service.js";

export const makeFindProductService = () => {
  const productRepository = makeProductRepository();
  return new FindProductService(productRepository);
};
