import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.ts";
import { DeleteProductCategoryService } from "@/services/product/category/delete-product-category-service.ts";

export const makeDeleteProductCategoryService = () => {
	const productCategoryRepository = makeProductCategoryRepository();
	return new DeleteProductCategoryService(productCategoryRepository);
};
