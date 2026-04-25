import z from "zod";

import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createAddonBodySchema } from "@/schemas/addon-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type CreateAddonServiceRequest = z.infer<typeof createAddonBodySchema> &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateAddonService {
  private addonRepository: IAddonRepository;

  constructor(addonRepository: IAddonRepository) {
    this.addonRepository = addonRepository;
  }

  async handle({
    categoryId,
    paramsToForget,
    ...data
  }: CreateAddonServiceRequest) {
    await this.addonRepository.create({
      ...data,
      category: {
        connect: {
          id: categoryId,
        },
      },
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "addons",
      paramsToForget,
    });
  }
}
