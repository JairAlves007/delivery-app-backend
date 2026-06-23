import { ProductNotFound } from "@/errors/product/not-found-error.js";
import type { IProductRecommendationRepository } from "@/interfaces/repositories/product-recommendation-repository.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type CreateManualRecommendationServiceRequest = {
  establishmentId: EstablishmentID;
  productId: string;
  recommendedProductId: string;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateManualRecommendationService {
  private productRecommendationRepository: IProductRecommendationRepository;
  private productRepository: IProductRepository;

  constructor(
    productRecommendationRepository: IProductRecommendationRepository,
    productRepository: IProductRepository,
  ) {
    this.productRecommendationRepository = productRecommendationRepository;
    this.productRepository = productRepository;
  }

  async handle({
    establishmentId,
    productId,
    recommendedProductId,
    paramsToForget,
  }: CreateManualRecommendationServiceRequest) {
    const filterParams = { establishment_id: establishmentId };

    const [product, recommendedProduct] = await Promise.all([
      this.productRepository.findById({ id: productId, filterParams }),
      this.productRepository.findById({
        id: recommendedProductId,
        filterParams,
      }),
    ]);

    if (!product || !recommendedProduct) throw new ProductNotFound();

    await this.productRecommendationRepository.createManual({
      establishmentId,
      productId,
      recommendedProductId,
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "products",
      paramsToForget,
    });
  }
}
