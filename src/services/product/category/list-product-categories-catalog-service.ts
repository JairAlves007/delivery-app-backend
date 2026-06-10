import z from "zod";

import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.js";
import {
  establishmentParamsSchema,
  listCursorQueryParamsSchema,
} from "@/schemas/generic-schema.js";
import { mapProductCategories } from "@/services/product/category/map-product-category.js";
import type { CursorPaginatedResponse } from "@/types/crud.js";
import type { ProductCategoryList } from "@/types/product-category.js";

type ListProductCategoriesCatalogServiceRequest = z.infer<
  typeof listCursorQueryParamsSchema
> &
  z.infer<typeof establishmentParamsSchema>;

type ListProductCategoriesCatalogServiceResponse =
  CursorPaginatedResponse<ProductCategoryList>;

export class ListProductCategoriesCatalogService {
  private productCategoryRepository: IProductCategoryRepository;

  constructor(productCategoryRepository: IProductCategoryRepository) {
    this.productCategoryRepository = productCategoryRepository;
  }

  public async handle({
    establishmentId,
    limit,
    cursor,
  }: ListProductCategoriesCatalogServiceRequest): Promise<ListProductCategoriesCatalogServiceResponse> {
    const cache = makeCache();
    const cursorSuffix = cursor ? `_cursor_${cursor}` : "";
    const prefixKey = getFilterParamsCacheKey({
      establishment_id: establishmentId,
    });
    const key = `${prefixKey}${cache.keys.productCategories}_limit_${limit}${cursorSuffix}`;

    const raw = await cache.remember(
      key,
      Constants.CACHE_TTL.productCategories,
      async () =>
        await this.productCategoryRepository.cursorPaginate({
          limit,
          cursor,
          filterParams: { establishment_id: establishmentId },
        }),
      { domain: "productCategories", establishmentId },
    );
    const hasNextPage = raw.length > limit;
    const productCategories = hasNextPage ? raw.slice(0, limit) : raw;
    const nextCursor = hasNextPage
      ? productCategories[productCategories.length - 1].id
      : null;

    if (productCategories.length <= 0) await cache.forget(key);

    return {
      items: mapProductCategories(productCategories),
      pagination: {
        nextCursor,
        hasNextPage: !!nextCursor,
      },
    };
  }
}
