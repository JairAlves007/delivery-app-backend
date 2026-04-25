import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { DeleteProductService } from "@/services/product/delete-product-service.js";

export const makeDeleteProductService = () => {
  const productRepository = makeProductRepository();
  return new DeleteProductService(productRepository);
};
