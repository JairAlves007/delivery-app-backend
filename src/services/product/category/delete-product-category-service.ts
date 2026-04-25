import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { FilterField } from "@/types/crud.js";

type DeleteProductCategoryServiceParams = {
  id: string;
} & FilterField &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteProductCategoryService {
  private productCategoryRepository: IProductCategoryRepository;

  constructor(productCategoryRepository: IProductCategoryRepository) {
    this.productCategoryRepository = productCategoryRepository;
  }

  async handle({
    id,
    filterParams,
    paramsToForget,
  }: DeleteProductCategoryServiceParams) {
    await this.productCategoryRepository.delete({
      id,
      filterParams,
      force: false,
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "productCategories",
      paramsToForget,
    });
  }
}
