import z from "zod";

import { slugify } from "@/helpers/utils.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createProductBodySchema } from "@/schemas/product-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type CreateProductServiceRequest = z.infer<typeof createProductBodySchema> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> & {
		establishmentId: EstablishmentID;
	};

export class CreateProductService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	async handle({
		establishmentId,
		categoryId,
		bannerIds,
		tagIds,
		discountPercentage: discount_percentage,
		validUntil: valid_until,
		pricingMode: pricing_mode,
		pricePer100g: price_per_100g,
		paramsToForget,
		...data
	}: CreateProductServiceRequest): Promise<void> {
		const banners = bannerIds
			? {
					connect: bannerIds.map(bannerId => ({ id: bannerId }))
				}
			: undefined;

		await this.productRepository.create({
			...data,
			slug: slugify(data.name),
			discount_percentage,
			valid_until,
			pricing_mode,
			price_per_100g: price_per_100g ?? null,
			establishment: {
				connect: {
					id: establishmentId
				}
			},
			category: {
				connect: {
					id: categoryId
				}
			},
			banners,
			tags: {
				create: tagIds.map(tagId => ({
					tag: { connect: { id: tagId } }
				}))
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "products",
			paramsToForget
		});
	}
}
