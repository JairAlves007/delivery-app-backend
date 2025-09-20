import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { slugify } from "@/helpers/utils.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { updateProductCategoryBodySchema } from "@/schemas/product-category-schema.ts";
import z from "zod";

type UpdateProductCategoryRequest = z.infer<
	typeof updateProductCategoryBodySchema
>;

export class UpdateProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle(
		id: string,
		{ name, establishmentId, bannerIds, ...data }: UpdateProductCategoryRequest
	) {
		const cache = makeCache();

		await this.productCategoryRepository.update(id, {
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
		});

		await cache.forgetKeysContaining(cache.keys.productCategories);
	}
}
