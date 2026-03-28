import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type DeleteProductCategoryServiceParams = {
	id: string;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle({ id, paramsToForget }: DeleteProductCategoryServiceParams) {
		await this.productCategoryRepository.delete({ id, force: false });

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "productCategories",
			paramsToForget
		});
	}
}
