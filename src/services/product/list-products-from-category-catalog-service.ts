import z from "zod";

import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import {
  establishmentParamsSchema,
  listCursorQueryParamsSchema,
} from "@/schemas/generic-schema.js";
import { listProductsFromCategorySchema } from "@/schemas/main-schema.js";
import { mapProducts } from "@/services/product/map-product.js";
import type { CursorPaginatedResponse } from "@/types/crud.js";
import type { ProductList } from "@/types/product.js";

type ListProductsFromCategoryCatalogServiceRequest = z.infer<
  typeof listCursorQueryParamsSchema
> &
  z.infer<typeof establishmentParamsSchema> &
  z.infer<typeof listProductsFromCategorySchema>;

type ListProductsFromCategoryCatalogServiceResponse =
  CursorPaginatedResponse<ProductList>;

export class ListProductsFromCategoryCatalogService {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  public async handle({
    establishmentId,
    categoryId,
    limit,
    cursor,
  }: ListProductsFromCategoryCatalogServiceRequest): Promise<ListProductsFromCategoryCatalogServiceResponse> {
    const cache = makeCache();
    const cursorSuffix = cursor ? `_cursor_${cursor}` : "";
    const filterParams = {
      establishment_id: establishmentId,
      category_id: categoryId,
    };
    const key = [
      getFilterParamsCacheKey(filterParams),
      cache.keys.products,
      "limit",
      limit,
      cursorSuffix,
    ].join("_");

    const raw = await cache.remember(
      key,
      Constants.CACHE_TTL.products,
      async () =>
        await this.productRepository.cursorPaginate({
          limit,
          cursor,
          filterParams,
        }),
      { domain: "products", establishmentId },
    );
    const hasNextPage = raw.length > limit;
    const products = hasNextPage ? raw.slice(0, limit) : raw;
    const nextCursor = hasNextPage ? products[products.length - 1].id : null;

    if (products.length <= 0) await cache.forget(key);

    return {
      items: mapProducts(products),
      pagination: {
        nextCursor,
        hasNextPage: !!nextCursor,
      },
    };
  }
}
