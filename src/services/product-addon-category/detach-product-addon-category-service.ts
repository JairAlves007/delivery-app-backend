import { AddonCategoryNotFound } from "@/errors/addon/category/not-found-error.js";
import { ProductNotFound } from "@/errors/product/not-found-error.js";
import type { IProductAddonCategoryRepository } from "@/interfaces/repositories/product-addon-category-repository.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type DetachProductAddonCategoryServiceRequest = Pick<
  ForgetAllListingCacheKeysParams,
  "paramsToForget"
> & {
  productId: string;
  addonCategoryId: number;
  establishmentId: EstablishmentID;
};

export class DetachProductAddonCategoryService {
  constructor(
    private productRepository: IProductRepository,
    private productAddonCategoryRepository: IProductAddonCategoryRepository,
  ) {}

  async handle({
    productId,
    addonCategoryId,
    establishmentId,
    paramsToForget,
  }: DetachProductAddonCategoryServiceRequest): Promise<void> {
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

    await this.productAddonCategoryRepository.detach({
      productId,
      addonCategoryId,
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
