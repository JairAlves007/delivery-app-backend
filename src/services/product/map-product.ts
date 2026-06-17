import { transformPriceFromDatabase } from "@/helpers/price.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type {
	ProductDetail,
	ProductFromRepository,
	ProductList
} from "@/types/product.js";
import type { ProductAddonCategoryFromRepository } from "@/types/product-addon-category.js";

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

export const mapProductAddonCategories = (
	items: ProductAddonCategoryFromRepository[]
): ProductDetail["addonCategories"] =>
	items.map(item => ({
		id: item.addonCategory.id,
		name: item.addonCategory.name,
		type: item.addonCategory.type,
		pricing_strategy: item.addonCategory.pricing_strategy,
		parts_count: item.addonCategory.parts_count,
		min_selection: item.min_selection,
		max_selection: item.max_selection,
		is_required: item.is_required,
		display_order: item.display_order,
		addons: item.addonCategory.addons.map(addon => ({
			id: addon.id,
			name: addon.name,
			price: transformPriceFromDatabase(addon.price)
		}))
	}));
