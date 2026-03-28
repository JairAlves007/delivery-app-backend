import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { UpdateProductService } from "@/services/product/update-product-service.js";

export const makeUpdateProductService = () => {
	const productRepository = makeProductRepository();
	return new UpdateProductService(productRepository);
};
