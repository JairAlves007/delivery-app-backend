import { makeProductRepository } from "@/factories/repositories/make-product-repository.ts";
import { FindProductService } from "@/services/product/find-product-service.ts";

export const makeFindProductService = () => {
	const productRepository = makeProductRepository();
	return new FindProductService(productRepository);
};
