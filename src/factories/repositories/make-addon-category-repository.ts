import { AddonCategoryPrismaRepository } from "@/repositories/addon-category-prisma-repository.js";

export const makeAddonCategoryRepository = () => {
  return new AddonCategoryPrismaRepository();
};
