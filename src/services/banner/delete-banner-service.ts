import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { FilterField } from "@/types/crud.js";

type DeleteBannerServiceParams = {
  id: number;
} & FilterField &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteBannerService {
  private bannerRepository: IBannerRepository;

  constructor(bannerRepository: IBannerRepository) {
    this.bannerRepository = bannerRepository;
  }

  async handle({
    id,
    filterParams,
    paramsToForget,
  }: DeleteBannerServiceParams) {
    await this.bannerRepository.delete({
      id,
      filterParams,
      force: false,
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "banners",
      paramsToForget,
    });
  }
}
