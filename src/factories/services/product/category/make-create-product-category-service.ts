import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.ts";
import { CreateProductCategoryService } from "@/services/product/category/create-product-category-service.ts";

export const makeCreateProductCategoryService = () => {
	const productCategoryRepository = makeProductCategoryRepository();
	return new CreateProductCategoryService(productCategoryRepository);
};
