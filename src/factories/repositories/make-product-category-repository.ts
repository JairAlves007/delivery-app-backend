import { ProductCategoryPrismaRepository } from "@/repositories/product-category-prisma-repository.js";

export const makeProductCategoryRepository = () => {
	return new ProductCategoryPrismaRepository();
};
