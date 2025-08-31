import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.ts";
import { UpdateAddonCategoryService } from "@/services/addon/category/update-addon-category-service.ts";

export const makeUpdateAddonCategoryService = () => {
	const addonCategoryRepository = makeAddonCategoryRepository();
	return new UpdateAddonCategoryService(addonCategoryRepository);
};
