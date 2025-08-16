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
		name,
		description,
		price,
		image_key,
		discount_percentage,
		stock,
		valid_until,
		establishmentId,
		categoryId
	}: CreateProductServiceRequest): Promise<void> {
		await this.productRepository.create({
			name,
			slug: slugify(name),
			description,
			price: transformPriceToDatabase(price),
			image_key,
			discount_percentage,
			stock,
			valid_until,
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
