import z from "zod";

import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createAddonCategoryBodySchema } from "@/schemas/addon-category-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type CreateAddonCategoryServiceRequest = z.infer<
	typeof createAddonCategoryBodySchema
> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> & {
		establishmentId: EstablishmentID;
	};

export class CreateAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle({
		establishmentId,
		pricingStrategy: pricing_strategy,
		partsCount: parts_count,
		paramsToForget,
		...data
	}: CreateAddonCategoryServiceRequest) {
		await this.addonCategoryRepository.create({
			...data,
			pricing_strategy,
			parts_count: parts_count ?? null,
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
