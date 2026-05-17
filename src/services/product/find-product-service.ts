import z from "zod";

import { ProductNotFound } from "@/errors/product/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import type { IProductAddonCategoryRepository } from "@/interfaces/repositories/product-addon-category-repository.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { productParamsSchema } from "@/schemas/product-schema.js";
import { mapProduct } from "@/services/product/map-product.js";
import type { FilterField } from "@/types/crud.js";
import type { ProductDetail } from "@/types/product.js";
import type { ProductAddonCategoryFromRepository } from "@/types/product-addon-category.js";

type FindProductServiceRequest = z.infer<typeof productParamsSchema> &
  FilterField;

const mapProductAddonCategories = (
  items: ProductAddonCategoryFromRepository[],
): ProductDetail["addonCategories"] =>
  items.map((item) => ({
    id: item.addonCategory.id,
    name: item.addonCategory.name,
    type: item.addonCategory.type,
    pricing_strategy: item.addonCategory.pricing_strategy,
    parts_count: item.addonCategory.parts_count,
    min_selection: item.min_selection,
    max_selection: item.max_selection,
    is_required: item.is_required,
    display_order: item.display_order,
    addons: item.addonCategory.addons.map((addon) => ({
      id: addon.id,
      name: addon.name,
      price: transformPriceFromDatabase(addon.price),
    })),
  }));

export class FindProductService {
  constructor(
    private productRepository: IProductRepository,
    private productAddonCategoryRepository: IProductAddonCategoryRepository,
  ) {}

  public async handle({
    id,
    filterParams,
  }: FindProductServiceRequest): Promise<ProductDetail> {
    const cache = makeCache();
    const filterPrefixKey = getFilterParamsCacheKey(filterParams);
    const productKey = `${filterPrefixKey}${cache.keys.products}_${id}`;
    const productAddonCategoriesKey = `${cache.keys.productAddonCategories}_${id}`;

    const [product, productAddonCategories] = await Promise.all([
      cache.rememberForever(
        productKey,
        async () => await this.productRepository.findById({ id, filterParams }),
      ),
      cache.remember(
        productAddonCategoriesKey,
        Constants.CACHE_TTL.addonCategories,
        async () =>
          await this.productAddonCategoryRepository.listByProductId(id),
      ),
    ]);

    if (!product) throw new ProductNotFound();

    return {
      ...mapProduct(product),
      addonCategories: mapProductAddonCategories(productAddonCategories),
    };
  }
}
