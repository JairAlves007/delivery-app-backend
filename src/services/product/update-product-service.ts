import z from "zod";

import { slugify } from "@/helpers/utils.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateProductBodySchema } from "@/schemas/product-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

interface UpdateProductRequest
	extends
		z.infer<typeof updateProductBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
	establishmentId: EstablishmentID;
}

export class UpdateProductService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	async handle({
		id,
		establishmentId,
		categoryId,
		name,
		bannerIds,
		tagIds,
		addonCategoryAttachments,
		paramsToForget,
		discountPercentage: discount_percentage,
		validUntil: valid_until,
		pricingMode: pricing_mode,
		pricePer100g: price_per_100g,
		...data
	}: UpdateProductRequest) {
		await this.productRepository.deleteOldTags(id);
		await this.productRepository.deleteOldProductAddonCategories(id);

		await this.productRepository.update({
			id,
			filterParams: { establishment_id: establishmentId },
			data: {
				...data,
				discount_percentage,
				valid_until,
				...(pricing_mode != null ? { pricing_mode } : {}),
				...(price_per_100g !== undefined ? { price_per_100g } : {}),
				name,
				...(!!name && { slug: slugify(name) }),
				...(categoryId && {
					category: {
						connect: { id: categoryId }
					}
				}),
				banners: {
					set: bannerIds?.map(bannerId => ({
						id: bannerId
					}))
				},
				tags: {
					create: tagIds?.map(tagId => ({
						tag: { connect: { id: tagId } }
					}))
				},
				addonCategories: {
					create: addonCategoryAttachments?.map(att => ({
						addon_category_id: att.addonCategoryId,
						display_order: att.displayOrder,
						is_required: att.isRequired,
						min_selection: att.minSelection ?? null,
						max_selection: att.maxSelection ?? null
					}))
				}
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "products",
			paramsToForget
		});
	}
}
