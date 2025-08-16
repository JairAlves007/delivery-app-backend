import { ProductPrismaRepository } from "@/repositories/product-prisma-repository.ts";

export const makeProductRepository = () => {
	return new ProductPrismaRepository();
};
