import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";

export class DeleteAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle(id: number) {
		const cache = makeCache();

		await this.addonCategoryRepository.delete(id, false);

		await cache.forgetKeysContaining(cache.keys.addonCategories);
	}
}
