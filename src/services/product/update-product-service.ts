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
		{ establishmentId, categoryId, ...data }: UpdateProductRequest
	) {
		return await this.productRepository.update(id, {
			...data,
			establishment: {
				connect: {
					id: establishmentId
				}
			},
			...(categoryId && {
				category: {
					connect: { id: categoryId }
				}
			})
		});
	}
}
