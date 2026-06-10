import z from "zod";

import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateAddonCategoryBodySchema } from "@/schemas/addon-category-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

interface UpdateAddonCategoryServiceRequest
	extends
		z.infer<typeof updateAddonCategoryBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: number;
	establishmentId: EstablishmentID;
}

export class UpdateAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle({
		id,
		establishmentId,
		addonIds,
		pricingStrategy: pricing_strategy,
		partsCount: parts_count,
		paramsToForget,
		status,
		...data
	}: UpdateAddonCategoryServiceRequest) {
		void status;
		const addons = addonIds
			? {
					set: addonIds.map(addonId => ({
						id: addonId
					}))
				}
			: undefined;

		await this.addonCategoryRepository.update({
			id,
			filterParams: { establishment_id: establishmentId },
			data: {
				...data,
				...(pricing_strategy != null ? { pricing_strategy } : {}),
				...(parts_count !== undefined ? { parts_count } : {}),
				addons
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "addonCategories",
			paramsToForget
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "productAddonCategories",
			paramsToForget
		});
	}
}
