import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";

type DeleteProductParams = {
	id: string;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteProductService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	public async handle({ id, paramsToForget }: DeleteProductParams) {
		await this.productRepository.delete({ id, force: false });

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "products",
			paramsToForget
		});
	}
}
