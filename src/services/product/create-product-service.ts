import { transformPriceToDatabase } from "@/helpers/price.ts";
import { slugify } from "@/helpers/utils.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { createProductBodySchema } from "@/schemas/product-schema.ts";
import z from "zod";

interface CreateProductServiceRequest
	extends z.infer<typeof createProductBodySchema> {
	establishmentId: string;
	categoryId: string;
}

export class CreateProductService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	async handle({
		establishmentId,
		categoryId,
		...data
	}: CreateProductServiceRequest): Promise<void> {
		await this.productRepository.create({
			...data,
			slug: slugify(data.name),
			price: transformPriceToDatabase(data.price),
			establishment: {
				connect: {
					id: establishmentId
				}
			},
			category: {
				connect: {
					id: categoryId
				}
			}
		});
	}
}
