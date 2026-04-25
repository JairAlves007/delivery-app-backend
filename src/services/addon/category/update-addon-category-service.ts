import z from "zod";

import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateAddonCategoryBodySchema } from "@/schemas/addon-category-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

interface UpdateAddonCategoryServiceRequest
  extends
    z.infer<typeof updateAddonCategoryBodySchema>,
    Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
  id: number;
  establishmentId: string;
}

export class UpdateAddonCategoryService {
  private addonCategoryRepository: IAddonCategoryRepository;

  constructor(addonCategoryRepository: IAddonCategoryRepository) {
    this.addonCategoryRepository = addonCategoryRepository;
  }

  async handle({
    id,
    establishmentId,
    addonIds,
    maxQuantity: max_quantity,
    paramsToForget,
    ...data
  }: UpdateAddonCategoryServiceRequest) {
    const addons = addonIds
      ? {
          set: addonIds.map((addonId) => ({
            id: addonId,
          })),
        }
      : undefined;

    await this.addonCategoryRepository.update({
      id,
      filterParams: { establishment_id: establishmentId },
      data: {
        ...data,
        max_quantity,
        addons,
      },
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "addonCategories",
      paramsToForget,
    });
  }
}
