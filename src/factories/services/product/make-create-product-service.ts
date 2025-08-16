import { makeProductRepository } from "@/factories/repositories/make-product-repository.ts";
import { CreateProductService } from "@/services/product/create-product-service.ts";

export const makeCreateProductService = () => {
	const productRepository = makeProductRepository();
	return new CreateProductService(productRepository);
};
