import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.ts";
import { CreateAddonCategoryService } from "@/services/addon/category/create-addon-category-service.ts";

export const makeCreateAddonCategoryService = () => {
	const addonCategoryRepository = makeAddonCategoryRepository();
	return new CreateAddonCategoryService(addonCategoryRepository);
};
