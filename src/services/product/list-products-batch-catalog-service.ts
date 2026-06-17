import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IProductAddonCategoryRepository } from "@/interfaces/repositories/product-addon-category-repository.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import {
  mapProduct,
  mapProductAddonCategories,
} from "@/services/product/map-product.js";
import type { FilterField } from "@/types/crud.js";
import type { ProductDetail } from "@/types/product.js";

type ListProductsBatchCatalogServiceRequest = {
  ids: string[];
} & FilterField;

export class ListProductsBatchCatalogService {
  constructor(
    private productRepository: IProductRepository,
    private productAddonCategoryRepository: IProductAddonCategoryRepository,
  ) {}

  public async handle({
    ids,
    filterParams,
  }: ListProductsBatchCatalogServiceRequest): Promise<ProductDetail[]> {
    const cache = makeCache();
    const filterPrefixKey = getFilterParamsCacheKey(filterParams);
    const establishmentId = filterParams?.establishment_id;

    const products = await Promise.all(
      ids.map(async (id) => {
        const productKey = `${filterPrefixKey}${cache.keys.products}_${id}`;
        const productAddonCategoriesKey = `${cache.keys.productAddonCategories}_${id}`;

        const [product, addonCategories] = await Promise.all([
          cache.remember(
            productKey,
            Constants.CACHE_TTL.products,
            async () =>
              await this.productRepository.findById({ id, filterParams }),
            { domain: "products", establishmentId },
          ),
          cache.remember(
            productAddonCategoriesKey,
            Constants.CACHE_TTL.addonCategories,
            async () =>
              await this.productAddonCategoryRepository.listByProductId(id),
            { domain: "productAddonCategories", establishmentId },
          ),
        ]);

        if (!product) return null;

        return {
          ...mapProduct(product),
          addonCategories: mapProductAddonCategories(addonCategories),
        };
      }),
    );

    return products.filter(
      (product): product is ProductDetail => product !== null,
    );
  }
}
