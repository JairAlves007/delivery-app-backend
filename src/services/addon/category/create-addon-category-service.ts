import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
import { createAddonCategoryBodySchema } from "@/schemas/addon-category-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

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
