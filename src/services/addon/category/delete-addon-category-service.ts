import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type DeleteAddonCategoryServiceParams = {
	id: number;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle({ id, paramsToForget }: DeleteAddonCategoryServiceParams) {
		await this.addonCategoryRepository.delete({
			id,
			force: false
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "addonCategories",
			paramsToForget
		});
	}
}
