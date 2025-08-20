import { ProductCategoryPrismaRepository } from "@/repositories/product-category-prisma-repository.ts";

export const makeProductCategoryRepository = () => {
	return new ProductCategoryPrismaRepository();
};
