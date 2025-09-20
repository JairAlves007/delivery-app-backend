import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { slugify } from "@/helpers/utils.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { updateProductBodySchema } from "@/schemas/product-schema.ts";
import z from "zod";

type UpdateProductRequest = z.infer<typeof updateProductBodySchema>;

export class UpdateProductService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	async handle(
		id: string,
		{
			establishmentId,
			categoryId,
			name,
			imageKey: image_key,
			bannerIds,
			tagIds,
			...data
		}: UpdateProductRequest
	) {
		const cache = makeCache();

		await this.productRepository.deleteOldTags(id);

		await this.productRepository.update(id, {
			...data,
			name,
			image_key,
			...(!!name && { slug: slugify(name) }),
			establishment: {
				connect: {
					id: establishmentId
				}
			},
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
		});

		await cache.forgetKeysContaining(cache.keys.products);
	}
}
