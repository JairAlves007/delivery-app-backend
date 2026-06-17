import z from "zod";

import { ProductNotFound } from "@/errors/product/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IProductAddonCategoryRepository } from "@/interfaces/repositories/product-addon-category-repository.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { productParamsSchema } from "@/schemas/product-schema.js";
import {
  mapProduct,
  mapProductAddonCategories,
} from "@/services/product/map-product.js";
import type { FilterField } from "@/types/crud.js";
import type { ProductDetail } from "@/types/product.js";

type FindProductServiceRequest = z.infer<typeof productParamsSchema> &
  FilterField;

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
      cache.remember(
        productKey,
        Constants.CACHE_TTL.products,
        async () => await this.productRepository.findById({ id, filterParams }),
        { domain: "products", establishmentId: filterParams?.establishment_id },
      ),
      cache.remember(
        productAddonCategoriesKey,
        Constants.CACHE_TTL.addonCategories,
        async () =>
          await this.productAddonCategoryRepository.listByProductId(id),
        {
          domain: "productAddonCategories",
          establishmentId: filterParams?.establishment_id,
        },
      ),
    ]);

    if (!product) throw new ProductNotFound();

    return {
      ...mapProduct(product),
      addonCategories: mapProductAddonCategories(productAddonCategories),
    };
  }
}
