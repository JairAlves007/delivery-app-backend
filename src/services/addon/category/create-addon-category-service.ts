import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { createAddonCategoryBodySchema } from "@/schemas/addon-category-schema.ts";
import z from "zod";

type CreateAddonCategoryServiceRequest = z.infer<
	typeof createAddonCategoryBodySchema
>;

export class CreateAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle({
		establishmentId,
		maxQuantity: max_quantity,
		...data
	}: CreateAddonCategoryServiceRequest) {
		const cache = makeCache();

		await this.addonCategoryRepository.create({
			...data,
			max_quantity,
			establishment: {
				connect: {
					id: establishmentId
				}
			}
		});

		await cache.forgetKeysContaining(cache.keys.addonCategories);
	}
}
