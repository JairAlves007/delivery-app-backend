import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";

export class DeleteProductService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	public async handle(id: string) {
		const cache = makeCache();

		await this.productRepository.delete({ id, force: false });

		await cache.forgetKeysContaining(cache.keys.products);
	}
}
