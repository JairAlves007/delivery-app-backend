import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { mapProducts } from "@/services/product/map-product.js";
import type { FilterField, PaginatedResponse } from "@/types/crud.js";
import type { ProductList } from "@/types/product.js";

type ListProductServiceRequest = z.infer<typeof listQueryParamsSchema> &
  FilterField;

type ListProductServiceResponse = PaginatedResponse<ProductList>;

export class ListProductService {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async handle({
    page,
    perPage,
    filterParams,
  }: ListProductServiceRequest): Promise<ListProductServiceResponse> {
    const cache = makeCache();
    const prefixKey = getFilterParamsCacheKey(filterParams);

    const isPaging = !!page;
    const totalPromise = cache.remember(
      `${prefixKey}total_${cache.keys.products}`,
      Constants.CACHE_TTL.products,
      async () => await this.productRepository.count(filterParams),
      { domain: "products", establishmentId: filterParams?.establishment_id },
    );

    if (isPaging) {
      const key = `${prefixKey}${cache.keys.products}_page_${page}_per_page_${perPage}`;
      const [total, products] = await Promise.all([
        totalPromise,
        cache.remember(
          key,
          Constants.CACHE_TTL.products,
          async () =>
            await this.productRepository.paginate({
              page,
              perPage,
              filterParams,
            }),
          {
            domain: "products",
            establishmentId: filterParams?.establishment_id,
          },
        ),
      ]);

      const totalPages = Math.ceil(total / perPage);

      if (page > totalPages && totalPages > 0) {
        await cache.forget(key);
        throw new InvalidPage();
      }

      return {
        items: mapProducts(products),
        pagination: {
          page,
          perPage,
          total,
          totalPages,
        },
      };
    }

    const [total, products] = await Promise.all([
      totalPromise,
      cache.remember(
        `${prefixKey}all_${cache.keys.products}`,
        Constants.CACHE_TTL.products,
        async () => await this.productRepository.listAll(filterParams),
        { domain: "products", establishmentId: filterParams?.establishment_id },
      ),
    ]);

    return {
      items: mapProducts(products),
      pagination: {
        page: 1,
        perPage: total,
        total,
        totalPages: 1,
      },
    };
  }
}
