import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { mapProductCategories } from "@/services/product/category/map-product-category.js";
import type { FilterField, PaginatedResponse } from "@/types/crud.js";
import type { ProductCategoryList } from "@/types/product-category.js";

type ListProductCategoryServiceRequest = z.infer<typeof listQueryParamsSchema> &
  FilterField;

type ListProductCategoryServiceResponse =
  PaginatedResponse<ProductCategoryList>;

export class ListProductCategoryService {
  private productCategoryRepository: IProductCategoryRepository;

  constructor(productCategoryRepository: IProductCategoryRepository) {
    this.productCategoryRepository = productCategoryRepository;
  }

  async handle({
    page,
    perPage,
    filterParams,
  }: ListProductCategoryServiceRequest): Promise<ListProductCategoryServiceResponse> {
    const cache = makeCache();
    const prefixKey = getFilterParamsCacheKey(filterParams);

    const isPaging = !!page;
    const totalPromise = cache.rememberForever(
      `${prefixKey}total_${cache.keys.productCategories}`,
      async () => await this.productCategoryRepository.count(filterParams),
    );

    if (isPaging) {
      const key = `${prefixKey}${cache.keys.productCategories}_page_${page}_per_page_${perPage}`;
      const [total, productCategories] = await Promise.all([
        totalPromise,
        cache.rememberForever(
          key,
          async () =>
            await this.productCategoryRepository.paginate({
              page,
              perPage,
              filterParams,
            }),
        ),
      ]);

      const totalPages = Math.ceil(total / perPage);

      if (page > totalPages && totalPages > 0) {
        await cache.forget(key);
        throw new InvalidPage();
      }

      return {
        items: mapProductCategories(productCategories),
        pagination: {
          page,
          perPage,
          total,
          totalPages,
        },
      };
    }

    const [total, productCategories] = await Promise.all([
      totalPromise,
      cache.rememberForever(
        `${prefixKey}all_${cache.keys.productCategories}`,
        async () => await this.productCategoryRepository.listAll(filterParams),
      ),
    ]);

    return {
      items: mapProductCategories(productCategories),
      pagination: {
        page: 1,
        perPage: total,
        total,
        totalPages: 1,
      },
    };
  }
}
