import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.js";
import { ListProductCategoryService } from "@/services/product/category/list-product-category-service.js";

export const makeListProductCategoryService = () => {
	const productCategoryRepository = makeProductCategoryRepository();
	return new ListProductCategoryService(productCategoryRepository);
};
