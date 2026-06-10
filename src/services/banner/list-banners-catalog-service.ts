import z from "zod";

import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.js";
import { establishmentParamsSchema } from "@/schemas/generic-schema.js";
import { mapBanners } from "@/services/banner/map-banner.js";
import type { BannerList } from "@/types/banner.js";
import type { ListResponse } from "@/types/crud.js";

type ListBannersCatalogServiceRequest = z.infer<
  typeof establishmentParamsSchema
>;

type ListBannersCatalogServiceResponse = ListResponse<BannerList>;

export class ListBannersCatalogService {
  private bannerRepository: IBannerRepository;

  constructor(bannerRepository: IBannerRepository) {
    this.bannerRepository = bannerRepository;
  }

  public async handle({
    establishmentId,
  }: ListBannersCatalogServiceRequest): Promise<ListBannersCatalogServiceResponse> {
    const cache = makeCache();
    const prefixKey = getFilterParamsCacheKey({
      establishment_id: establishmentId,
    });
    const key = `${prefixKey}all_${cache.keys.banners}`;

    const banners = await cache.remember(
      key,
      Constants.CACHE_TTL.banners,
      async () =>
        await this.bannerRepository.listAll({
          establishment_id: establishmentId,
        }),
      { domain: "banners", establishmentId },
    );

    if (banners.length <= 0) await cache.forget(key);

    return {
      items: mapBanners(banners),
    };
  }
}
