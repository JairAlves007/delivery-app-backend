import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.ts";
import { ListProductCategoriesCatalogService } from "@/services/product/category/list-product-categories-catalog-service.ts";

export const makeListProductCategoriesCatalogService = () => {
	const productCategoryRepository = makeProductCategoryRepository();
	return new ListProductCategoriesCatalogService(productCategoryRepository);
};
