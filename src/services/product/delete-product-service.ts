import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.ts";
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

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "products",
			paramsToForget
		});
	}
}
