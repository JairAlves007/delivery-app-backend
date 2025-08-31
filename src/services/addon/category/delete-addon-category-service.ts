import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";

export class DeleteAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle(id: number) {
		await this.addonCategoryRepository.delete(id, false);
	}
}
