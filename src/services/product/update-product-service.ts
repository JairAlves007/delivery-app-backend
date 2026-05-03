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
		paramsToForget,
		discountPercentage: discount_percentage,
		validUntil: valid_until,
		...data
	}: UpdateProductRequest) {
		await this.productRepository.deleteOldTags(id);

		await this.productRepository.update({
			id,
			filterParams: { establishment_id: establishmentId },
			data: {
				...data,
				discount_percentage,
				valid_until,
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
				}
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "products",
			paramsToForget
		});
	}
}
