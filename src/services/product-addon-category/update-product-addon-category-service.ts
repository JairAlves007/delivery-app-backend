import z from "zod";

import { AddonCategoryNotFound } from "@/errors/addon/category/not-found-error.js";
import { ProductNotFound } from "@/errors/product/not-found-error.js";
import { AddonType } from "@/generated/prisma/client.js";
import type { IProductAddonCategoryRepository } from "@/interfaces/repositories/product-addon-category-repository.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateProductAddonCategoryBodySchema } from "@/schemas/product-addon-category-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type UpdateProductAddonCategoryServiceRequest = z.infer<
  typeof updateProductAddonCategoryBodySchema
> &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> & {
    productId: string;
    addonCategoryId: number;
    establishmentId: EstablishmentID;
  };

export class UpdateProductAddonCategoryService {
  constructor(
    private productRepository: IProductRepository,
    private productAddonCategoryRepository: IProductAddonCategoryRepository,
  ) {}

  async handle({
    productId,
    addonCategoryId,
    establishmentId,
    displayOrder,
    isRequired,
    minSelection,
    maxSelection,
    paramsToForget,
  }: UpdateProductAddonCategoryServiceRequest): Promise<void> {
    const product = await this.productRepository.findById({
      id: productId,
      filterParams: { establishment_id: establishmentId },
    });
    if (!product) throw new ProductNotFound();

    const junction =
      await this.productAddonCategoryRepository.findByProductAndCategory({
        productId,
        addonCategoryId,
      });
    if (!junction) throw new AddonCategoryNotFound();

    const coercedMax =
      junction.addonCategory.type === AddonType.SINGLE_CHOICE
        ? 1
        : (maxSelection ?? null);

    await this.productAddonCategoryRepository.update({
      id: junction.id,
      data: {
        display_order: displayOrder,
        is_required: isRequired,
        min_selection: minSelection ?? null,
        max_selection: coercedMax,
      },
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "products",
      paramsToForget,
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "productAddonCategories",
      paramsToForget,
    });
  }
}
