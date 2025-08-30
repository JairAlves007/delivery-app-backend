import { slugify } from "@/helpers/utils.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { createProductBodySchema } from "@/schemas/product-schema.ts";
import z from "zod";

type CreateProductServiceRequest = z.infer<typeof createProductBodySchema>;

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
