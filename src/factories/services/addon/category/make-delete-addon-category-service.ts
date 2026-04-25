import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.js";
import { DeleteAddonCategoryService } from "@/services/addon/category/delete-addon-category-service.js";

export const makeDeleteAddonCategoryService = () => {
  const addonCategoryRepository = makeAddonCategoryRepository();
  return new DeleteAddonCategoryService(addonCategoryRepository);
};
