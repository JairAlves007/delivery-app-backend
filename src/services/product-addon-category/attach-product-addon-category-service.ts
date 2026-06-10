import z from "zod";

import { AddonCategoryNotFound } from "@/errors/addon/category/not-found-error.js";
import { ProductNotFound } from "@/errors/product/not-found-error.js";
import { AddonType } from "@/generated/prisma/client.js";
import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.js";
import type { IProductAddonCategoryRepository } from "@/interfaces/repositories/product-addon-category-repository.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { attachProductAddonCategoryBodySchema } from "@/schemas/product-addon-category-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type AttachProductAddonCategoryServiceRequest = z.infer<
  typeof attachProductAddonCategoryBodySchema
> &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> & {
    productId: string;
    establishmentId: EstablishmentID;
  };

export class AttachProductAddonCategoryService {
  constructor(
    private productRepository: IProductRepository,
    private addonCategoryRepository: IAddonCategoryRepository,
    private productAddonCategoryRepository: IProductAddonCategoryRepository,
  ) {}

  async handle({
    productId,
    establishmentId,
    addonCategoryId,
    displayOrder,
    isRequired,
    minSelection,
    maxSelection,
    paramsToForget,
  }: AttachProductAddonCategoryServiceRequest): Promise<void> {
    const product = await this.productRepository.findById({
      id: productId,
      filterParams: { establishment_id: establishmentId },
    });
    if (!product) throw new ProductNotFound();

    const category = await this.addonCategoryRepository.findById({
      id: addonCategoryId,
      filterParams: { establishment_id: establishmentId },
    });
    if (!category) throw new AddonCategoryNotFound();

    const coercedMax = this.coerceMaxByType(category.type, maxSelection);

    await this.productAddonCategoryRepository.attach({
      product_id: productId,
      addon_category_id: addonCategoryId,
      display_order: displayOrder,
      is_required: isRequired,
      min_selection: minSelection ?? null,
      max_selection: coercedMax,
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

  private coerceMaxByType(
    type: AddonType,
    maxSelection: number | null | undefined,
  ): number | null {
    if (type === AddonType.SINGLE_CHOICE) return 1;
    return maxSelection ?? null;
  }
}
