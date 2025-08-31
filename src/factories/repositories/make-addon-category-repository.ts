import { AddonCategoryPrismaRepository } from "@/repositories/addon-category-prisma-repository.ts";

export const makeAddonCategoryRepository = () => {
	return new AddonCategoryPrismaRepository();
};
