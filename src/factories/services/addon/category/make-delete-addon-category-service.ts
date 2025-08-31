import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.ts";
import { DeleteAddonCategoryService } from "@/services/addon/category/delete-addon-category-service.ts";

export const makeDeleteAddonCategoryService = () => {
	const addonCategoryRepository = makeAddonCategoryRepository();
	return new DeleteAddonCategoryService(addonCategoryRepository);
};
