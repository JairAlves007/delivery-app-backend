import { transformPriceFromDatabase } from "@/helpers/price.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type { ProductFromRepository, ProductList } from "@/types/product.js";

export const mapProduct = (
  product: ProductFromRepository,
  isFavorited = false,
): ProductList => ({
  ...product,
  price: transformPriceFromDatabase(product.price),
  resources: mapObjectResourcesList(product.resources),
  tags: product.tags.map(({ tag }) => tag),
  isFavorited,
});

export const mapProducts = (products: ProductFromRepository[]): ProductList[] =>
  products.map((product) => mapProduct(product));
