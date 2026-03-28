import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.js";
import { UpdateAddonCategoryService } from "@/services/addon/category/update-addon-category-service.js";

export const makeUpdateAddonCategoryService = () => {
	const addonCategoryRepository = makeAddonCategoryRepository();
	return new UpdateAddonCategoryService(addonCategoryRepository);
};
