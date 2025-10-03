import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.ts";
import { FindAddonCategoryService } from "@/services/addon/category/find-addon-category-service.ts";

export const makeFindAddonCategoryService = () => {
	const addonCategoryRepository = makeAddonCategoryRepository();
	return new FindAddonCategoryService(addonCategoryRepository);
};
