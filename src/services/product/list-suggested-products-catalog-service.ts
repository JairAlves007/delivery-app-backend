import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import type { ProductFromRepository, ProductList } from "@/types/product.js";

type ListSuggestedProductsCatalogServiceRequest = {
	establishmentId: string;
	productId: string;
	limit: number;
};

type ListSuggestedProductsCatalogServiceResponse = {
	items: ProductList[];
};

export class ListSuggestedProductsCatalogService {
	private productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	private mapProducts(products: ProductFromRepository[]): ProductList[] {
		return products.map(product => {
			return {
				...product,
				price: transformPriceFromDatabase(product.price),
				resources: mapObjectResourcesList(product.resources),
				tags: product.tags.map(({ tag }) => tag)
			};
		});
	}

	public async handle({
		establishmentId,
		productId,
		limit
	}: ListSuggestedProductsCatalogServiceRequest): Promise<ListSuggestedProductsCatalogServiceResponse> {
		const cache = makeCache();
		const key = `${cache.keys.products}_suggested_${establishmentId}_${productId}_limit_${limit}`;

		const products = await cache.remember(
			key,
			Constants.CACHE_TTL.products,
			async () =>
				await this.productRepository.findSuggested({
					productId,
					establishmentId,
					limit
				})
		);

		return { items: this.mapProducts(products) };
	}
}
