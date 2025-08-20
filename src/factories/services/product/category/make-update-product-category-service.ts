import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.ts";
import { UpdateProductCategoryService } from "@/services/product/category/update-product-category-service.ts";

export const makeUpdateProductCategoryService = () => {
	const productCategoryRepository = makeProductCategoryRepository();
	return new UpdateProductCategoryService(productCategoryRepository);
};
