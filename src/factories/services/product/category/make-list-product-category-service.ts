import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.ts";
import { ListProductCategoryService } from "@/services/product/category/list-product-category-service.ts";

export const makeListProductCategoryService = () => {
	const productCategoryRepository = makeProductCategoryRepository();
	return new ListProductCategoryService(productCategoryRepository);
};
