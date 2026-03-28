import z from "zod";

import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createAddonCategoryBodySchema } from "@/schemas/addon-category-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type CreateAddonCategoryServiceRequest = z.infer<
	typeof createAddonCategoryBodySchema
> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle({
		establishmentId,
		maxQuantity: max_quantity,
		paramsToForget,
		...data
	}: CreateAddonCategoryServiceRequest) {
		await this.addonCategoryRepository.create({
			...data,
			max_quantity,
			establishment: {
				connect: {
					id: establishmentId
				}
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "addonCategories",
			paramsToForget
		});
	}
}
