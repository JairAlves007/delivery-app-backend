import { makeProductRepository } from "@/factories/repositories/make-product-repository.ts";
import { ListProductService } from "@/services/product/list-product-service.ts";

export const makeListProductService = () => {
	const productRepository = makeProductRepository();
	return new ListProductService(productRepository);
};
