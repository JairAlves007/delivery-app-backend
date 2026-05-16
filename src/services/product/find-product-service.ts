import z from "zod";

import { ProductNotFound } from "@/errors/product/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { productParamsSchema } from "@/schemas/product-schema.js";
import { mapProduct } from "@/services/product/map-product.js";
import type { AddonCategoryFromRepository } from "@/types/addon-category.js";
import type { FilterField } from "@/types/crud.js";
import type { ProductDetail } from "@/types/product.js";

type FindProductServiceRequest = z.infer<typeof productParamsSchema> &
  FilterField;

const mapAddonCategories = (
  categories: AddonCategoryFromRepository[],
): ProductDetail["addonCategories"] =>
  categories.map((category) => ({
    id: category.id,
    name: category.name,
    type: category.type,
    max_quantity: category.max_quantity,
    addons: category.addons.map((addon) => ({
      id: addon.id,
      name: addon.name,
      price: transformPriceFromDatabase(addon.price),
    })),
  }));

export class FindProductService {
  private productRepository: IProductRepository;
  private addonCategoryRepository: IAddonCategoryRepository;

  constructor(
    productRepository: IProductRepository,
    addonCategoryRepository: IAddonCategoryRepository,
  ) {
    this.productRepository = productRepository;
    this.addonCategoryRepository = addonCategoryRepository;
  }

  public async handle({
    id,
    filterParams,
  }: FindProductServiceRequest): Promise<ProductDetail> {
    const cache = makeCache();
    const filterPrefixKey = getFilterParamsCacheKey(filterParams);
    const productKey = `${filterPrefixKey}${cache.keys.products}_${id}`;
    const establishmentId = filterParams?.establishment_id ?? undefined;
    const addonCategoriesFilter = { establishment_id: establishmentId };
    const addonCategoriesKey = `${getFilterParamsCacheKey(addonCategoriesFilter)}all_${cache.keys.addonCategories}`;

    const [product, addonCategories] = await Promise.all([
      cache.rememberForever(
        productKey,
        async () => await this.productRepository.findById({ id, filterParams }),
      ),
      cache.remember(
        addonCategoriesKey,
        Constants.CACHE_TTL.addonCategories,
        async () =>
          await this.addonCategoryRepository.listAll(addonCategoriesFilter),
      ),
    ]);

    if (!product) throw new ProductNotFound();

    return {
      ...mapProduct(product),
      addonCategories: mapAddonCategories(addonCategories),
    };
  }
}
