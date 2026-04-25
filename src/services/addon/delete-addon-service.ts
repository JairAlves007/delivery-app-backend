import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { FilterField } from "@/types/crud.js";

type DeleteAddonParams = {
  id: number;
} & FilterField &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteAddonService {
  private addonRepository: IAddonRepository;

  constructor(addonRepository: IAddonRepository) {
    this.addonRepository = addonRepository;
  }

  async handle({ id, paramsToForget, filterParams }: DeleteAddonParams) {
    await this.addonRepository.delete({
      id,
      filterParams,
      force: false,
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "addons",
      paramsToForget,
    });
  }
}
