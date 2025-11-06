import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { slugify } from "@/helpers/utils.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { updateProductCategoryBodySchema } from "@/schemas/product-category-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

interface UpdateProductCategoryRequest
	extends z.infer<typeof updateProductCategoryBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
}

export class UpdateProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle({
		id,
		name,
		establishmentId,
		bannerIds,
		paramsToForget,
		...data
	}: UpdateProductCategoryRequest) {
		await this.productCategoryRepository.update({
			id,
			data: {
				...data,
				...(!!name && { slug: slugify(name) }),
				establishment: {
					connect: {
						id: establishmentId
					}
				},
				banners: {
					set: bannerIds?.map(bannerId => ({
						id: bannerId
					}))
				}
			}
		});

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "productCategories",
			paramsToForget
		});
	}
}
