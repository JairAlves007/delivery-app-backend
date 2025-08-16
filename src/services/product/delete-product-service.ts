import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";

export class DeleteProductService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	public async handle(id: string) {
		await this.productRepository.delete(id, false);
	}
}
