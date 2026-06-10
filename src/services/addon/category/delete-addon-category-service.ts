import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { FilterField } from "@/types/crud.js";

type DeleteAddonCategoryServiceParams = {
  id: number;
} & FilterField &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteAddonCategoryService {
  private addonCategoryRepository: IAddonCategoryRepository;

  constructor(addonCategoryRepository: IAddonCategoryRepository) {
    this.addonCategoryRepository = addonCategoryRepository;
  }

  async handle({
    id,
    filterParams,
    paramsToForget,
  }: DeleteAddonCategoryServiceParams) {
    await this.addonCategoryRepository.delete({
      id,
      filterParams,
      force: false,
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "addonCategories",
      paramsToForget,
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "productAddonCategories",
      paramsToForget,
    });
  }
}
