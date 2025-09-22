import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";

export class DeleteProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle(id: string) {
		const cache = makeCache();

		await this.productCategoryRepository.delete({ id, force: false });

		await cache.forgetKeysContaining(cache.keys.productCategories);
	}
}
