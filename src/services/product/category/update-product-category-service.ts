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
		{ establishmentId, bannerIds, ...data }: UpdateProductCategoryRequest
	) {
		const banners = !!bannerIds
			? {
					set: bannerIds.map(bannerId => ({
						id: bannerId
					}))
			  }
			: undefined;

		return await this.productCategoryRepository.update(id, {
			...data,
			establishment: {
				connect: {
					id: establishmentId
				}
			},
			banners
		});
	}
}
