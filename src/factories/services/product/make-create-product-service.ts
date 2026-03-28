import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { CreateProductService } from "@/services/product/create-product-service.js";

export const makeCreateProductService = () => {
	const productRepository = makeProductRepository();
	return new CreateProductService(productRepository);
};
