import { slugify } from "@/helpers/utils.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";
import { createProductCategoryBodySchema } from "@/schemas/product-category-schema.ts";
import z from "zod";

interface CreateProductCategoryServiceRequest
	extends z.infer<typeof createProductCategoryBodySchema> {
	establishmentId: string;
}

export class CreateProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle({
		establishmentId,
		...data
	}: CreateProductCategoryServiceRequest) {
		return await this.productCategoryRepository.create({
			...data,
			slug: slugify(data.name),
			establishment: {
				connect: {
					id: establishmentId
				}
			}
		});
	}
}
