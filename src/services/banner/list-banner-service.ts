import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import { mapBanners } from "@/services/banner/map-banner.js";
import type { BannerList } from "@/types/banner.js";
import type { FilterField, PaginatedResponse } from "@/types/crud.js";

type ListBannerServiceRequest = z.infer<typeof listQueryParamsSchema> &
  FilterField;

type ListBannerServiceResponse = PaginatedResponse<BannerList>;

export class ListBannerService {
  private bannerRepository: IBannerRepository;

  constructor(bannerRepository: IBannerRepository) {
    this.bannerRepository = bannerRepository;
  }

  async handle({
    page,
    perPage,
    filterParams,
  }: ListBannerServiceRequest): Promise<ListBannerServiceResponse> {
    const cache = makeCache();
    const prefixKey = getFilterParamsCacheKey(filterParams);

    const isPaging = !!page;
    const totalPromise = cache.remember(
      `${prefixKey}total_${cache.keys.banners}`,
      Constants.CACHE_TTL.banners,
      async () => await this.bannerRepository.count(filterParams),
    );

    if (isPaging) {
      const key = `${prefixKey}${cache.keys.banners}_page_${page}_per_page_${perPage}`;

      const [total, banners] = await Promise.all([
        totalPromise,
        cache.remember(
          key,
          Constants.CACHE_TTL.banners,
          async () =>
            await this.bannerRepository.paginate({
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
        items: mapBanners(banners),
        pagination: {
          page,
          perPage,
          total,
          totalPages,
        },
      };
    }

    const [total, banners] = await Promise.all([
      totalPromise,
      cache.remember(
        `${prefixKey}all_${cache.keys.banners}`,
        Constants.CACHE_TTL.banners,
        async () => await this.bannerRepository.listAll(),
      ),
    ]);

    return {
      items: mapBanners(banners),
      pagination: {
        page: 1,
        perPage: total,
        total,
        totalPages: 1,
      },
    };
  }
}
