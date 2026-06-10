import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { establishmentParamsSchema } from "@/schemas/generic-schema.js";
import { searchProductsCatalogQuerySchema } from "@/schemas/main-schema.js";
import { mapProducts } from "@/services/product/map-product.js";
import type { PaginatedResponse } from "@/types/crud.js";
import type { ProductList } from "@/types/product.js";

type SearchProductsCatalogServiceRequest = z.infer<
  typeof searchProductsCatalogQuerySchema
> &
  z.infer<typeof establishmentParamsSchema>;

type SearchProductsCatalogServiceResponse = PaginatedResponse<ProductList>;

export class SearchProductsCatalogService {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  public async handle({
    establishmentId,
    categoryId,
    search,
    similarityThreshold,
    page,
    perPage,
  }: SearchProductsCatalogServiceRequest): Promise<SearchProductsCatalogServiceResponse> {
    const cache = makeCache();
    const currentPage = page ?? 1;
    const filterParams = {
      establishment_id: establishmentId,
      category_id: categoryId ?? undefined,
      search,
    };
    const prefixKey = getFilterParamsCacheKey(filterParams);
    const thresholdSuffix =
      similarityThreshold !== null && similarityThreshold !== undefined
        ? `_th_${similarityThreshold}`
        : "";

    const totalKey = `${prefixKey}${cache.keys.products}_search_total${thresholdSuffix}`;
    const pageKey = `${prefixKey}${cache.keys.products}_search_page_${currentPage}_per_page_${perPage}${thresholdSuffix}`;

    const repoArgs = {
      establishmentId,
      categoryId: categoryId ?? undefined,
      search,
      similarityThreshold: similarityThreshold ?? undefined,
    };

    const [total, products] = await Promise.all([
      cache.remember(
        totalKey,
        Constants.CACHE_TTL.products,
        async () => await this.productRepository.countSearchCatalog(repoArgs),
        { domain: "products", establishmentId },
      ),
      cache.remember(
        pageKey,
        Constants.CACHE_TTL.products,
        async () =>
          await this.productRepository.searchCatalog({
            ...repoArgs,
            page: currentPage,
            perPage,
          }),
        { domain: "products", establishmentId },
      ),
    ]);

    const totalPages = Math.ceil(total / perPage);

    if (currentPage > totalPages && totalPages > 0) {
      await cache.forget(pageKey);
      throw new InvalidPage();
    }

    return {
      items: mapProducts(products),
      pagination: {
        page: currentPage,
        perPage,
        total,
        totalPages: Math.max(totalPages, 0),
      },
    };
  }
}
