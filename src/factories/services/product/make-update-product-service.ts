import { makeProductRepository } from "@/factories/repositories/make-product-repository.ts";
import { UpdateProductService } from "@/services/product/update-product-service.ts";

export const makeUpdateProductService = () => {
	const productRepository = makeProductRepository();
	return new UpdateProductService(productRepository);
};
