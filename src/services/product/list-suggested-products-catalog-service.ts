import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { mapProducts } from "@/services/product/map-product.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { ProductList } from "@/types/product.js";

type ListSuggestedProductsCatalogServiceRequest = {
	establishmentId: EstablishmentID;
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
				}),
			{ domain: "products", establishmentId }
		);

		return { items: mapProducts(products) };
	}
}
