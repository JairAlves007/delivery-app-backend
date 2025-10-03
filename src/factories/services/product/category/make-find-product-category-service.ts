import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.ts";
import { FindProductCategoryService } from "@/services/product/category/find-product-category-service.ts";

export const makeFindProductCategoryService = () => {
	const productCategoryRepository = makeProductCategoryRepository();
	return new FindProductCategoryService(productCategoryRepository);
};
