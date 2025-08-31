import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.ts";
import { ListAddonCategoryService } from "@/services/addon/category/list-addon-category-service.ts";

export const makeListAddonCategoryService = () => {
	const addonCategoryRepository = makeAddonCategoryRepository();
	return new ListAddonCategoryService(addonCategoryRepository);
};
