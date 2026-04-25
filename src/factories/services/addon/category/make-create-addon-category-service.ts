import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.js";
import { CreateAddonCategoryService } from "@/services/addon/category/create-addon-category-service.js";

export const makeCreateAddonCategoryService = () => {
  const addonCategoryRepository = makeAddonCategoryRepository();
  return new CreateAddonCategoryService(addonCategoryRepository);
};
