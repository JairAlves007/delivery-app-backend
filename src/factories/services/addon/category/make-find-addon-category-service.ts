import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.js";
import { FindAddonCategoryService } from "@/services/addon/category/find-addon-category-service.js";

export const makeFindAddonCategoryService = () => {
	const addonCategoryRepository = makeAddonCategoryRepository();
	return new FindAddonCategoryService(addonCategoryRepository);
};
