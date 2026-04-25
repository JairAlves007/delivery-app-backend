import z from "zod";

import { BannerNotFound } from "@/errors/banner/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.js";
import { bannerParamsSchema } from "@/schemas/banner-schema.js";
import { mapBanner } from "@/services/banner/map-banner.js";
import type { BannerList } from "@/types/banner.js";
import type { FilterField } from "@/types/crud.js";

type FindBannerServiceRequest = z.infer<typeof bannerParamsSchema> &
  FilterField;

export class FindBannerService {
  private bannerRepository: IBannerRepository;

  constructor(bannerRepository: IBannerRepository) {
    this.bannerRepository = bannerRepository;
  }

  async handle({
    id,
    filterParams,
  }: FindBannerServiceRequest): Promise<BannerList> {
    const cache = makeCache();
    const filterPrefixKey = getFilterParamsCacheKey(filterParams);
    const key = `${filterPrefixKey}${cache.keys.banners}_${id}`;

    const banner = await cache.remember(
      key,
      Constants.CACHE_TTL.banners,
      async () => await this.bannerRepository.findById({ id, filterParams }),
    );

    if (!banner) throw new BannerNotFound();

    return mapBanner(banner);
  }
}
