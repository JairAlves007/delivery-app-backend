import { ProductPrismaRepository } from "@/repositories/product-prisma-repository.js";

export const makeProductRepository = () => {
	return new ProductPrismaRepository();
};
