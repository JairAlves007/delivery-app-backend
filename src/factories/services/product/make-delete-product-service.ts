import { makeProductRepository } from "@/factories/repositories/make-product-repository.ts";
import { DeleteProductService } from "@/services/product/delete-product-service.ts";

export const makeDeleteProductService = () => {
	const productRepository = makeProductRepository();
	return new DeleteProductService(productRepository);
};
