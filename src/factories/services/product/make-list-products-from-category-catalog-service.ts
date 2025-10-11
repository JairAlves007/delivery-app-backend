import { makeProductRepository } from "@/factories/repositories/make-product-repository.ts";
import { ListProductsFromCategoryCatalogService } from "@/services/product/list-products-from-category-catalog-service.ts";

export const makeListProductsFromCategoryCatalogService = () => {
	const productRepository = makeProductRepository();
	return new ListProductsFromCategoryCatalogService(productRepository);
};
