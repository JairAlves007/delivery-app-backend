import { transformPriceFromDatabase } from "@/helpers/price.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type { ProductFromRepository, ProductList } from "@/types/product.js";

export const mapProduct = (product: ProductFromRepository): ProductList => ({
	...product,
	price: transformPriceFromDatabase(product.price),
	price_per_100g:
		product.price_per_100g != null
			? transformPriceFromDatabase(product.price_per_100g)
			: null,
	resources: mapObjectResourcesList(product.resources),
	tags: product.tags.map(({ tag }) => tag)
});

export const mapProducts = (products: ProductFromRepository[]): ProductList[] =>
	products.map(product => mapProduct(product));
