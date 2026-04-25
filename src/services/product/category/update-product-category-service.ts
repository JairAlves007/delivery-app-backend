import z from "zod";

import { slugify } from "@/helpers/utils.js";
import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateProductCategoryBodySchema } from "@/schemas/product-category-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

interface UpdateProductCategoryRequest
  extends
    z.infer<typeof updateProductCategoryBodySchema>,
    Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
  id: string;
  establishmentId: string;
}

export class UpdateProductCategoryService {
  private productCategoryRepository: IProductCategoryRepository;

  constructor(productCategoryRepository: IProductCategoryRepository) {
    this.productCategoryRepository = productCategoryRepository;
  }

  async handle({
    id,
    name,
    establishmentId,
    bannerIds,
    paramsToForget,
    ...data
  }: UpdateProductCategoryRequest) {
    await this.productCategoryRepository.update({
      id,
      filterParams: { establishment_id: establishmentId },
      data: {
        ...data,
        ...(!!name && { slug: slugify(name) }),
        banners: {
          set: bannerIds?.map((bannerId) => ({
            id: bannerId,
          })),
        },
      },
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "productCategories",
      paramsToForget,
    });
  }
}
