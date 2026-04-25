import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { FilterField } from "@/types/crud.js";

type DeleteDistrictParams = {
  id: string;
} & FilterField &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteDistrictService {
  private districtRepository: IDistrictRepository;

  constructor(districtRepository: IDistrictRepository) {
    this.districtRepository = districtRepository;
  }

  async handle({ id, filterParams, paramsToForget }: DeleteDistrictParams) {
    await this.districtRepository.delete({
      id,
      filterParams,
      force: false,
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "districts",
      paramsToForget,
    });
  }
}
