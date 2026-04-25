import z from "zod";

import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateAddonBodySchema } from "@/schemas/addon-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

interface UpdateAddonServiceRequest
  extends
    z.infer<typeof updateAddonBodySchema>,
    Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
  id: number;
}

export class UpdateAddonService {
  private addonRepository: IAddonRepository;

  constructor(addonRepository: IAddonRepository) {
    this.addonRepository = addonRepository;
  }

  async handle({
    id,
    categoryId,
    paramsToForget,
    ...data
  }: UpdateAddonServiceRequest) {
    await this.addonRepository.update({
      id,
      data: {
        ...data,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "addons",
      paramsToForget,
    });
  }
}
