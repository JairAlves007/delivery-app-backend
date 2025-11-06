import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { updateAddonCategoryBodySchema } from "@/schemas/addon-category-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

interface UpdateAddonCategoryServiceRequest
	extends z.infer<typeof updateAddonCategoryBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: number;
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
		maxQuantity: max_quantity,
		paramsToForget,
		...data
	}: UpdateAddonCategoryServiceRequest) {
		const addons = !!addonIds
			? {
					set: addonIds.map(addonId => ({
						id: addonId
					}))
			  }
			: undefined;

		await this.addonCategoryRepository.update({
			id,
			data: {
				...data,
				max_quantity,
				establishment: {
					connect: {
						id: establishmentId
					}
				},
				addons
			}
		});

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "addonCategories",
			paramsToForget
		});
	}
}
