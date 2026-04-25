import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.js";
import { ListAddonCategoryService } from "@/services/addon/category/list-addon-category-service.js";

export const makeListAddonCategoryService = () => {
  const addonCategoryRepository = makeAddonCategoryRepository();
  return new ListAddonCategoryService(addonCategoryRepository);
};
