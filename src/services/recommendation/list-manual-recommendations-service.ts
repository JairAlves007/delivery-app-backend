import type { RecommendationSource } from "@/generated/prisma/client.js";
import type { IProductRecommendationRepository } from "@/interfaces/repositories/product-recommendation-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";

type ListManualRecommendationsServiceRequest = {
  establishmentId: EstablishmentID;
};

type RecommendationItem = {
  id: string;
  source: RecommendationSource;
  product: { id: string; name: string };
  recommended_product: { id: string; name: string };
};

export class ListManualRecommendationsService {
  private productRecommendationRepository: IProductRecommendationRepository;

  constructor(
    productRecommendationRepository: IProductRecommendationRepository,
  ) {
    this.productRecommendationRepository = productRecommendationRepository;
  }

  async handle({
    establishmentId,
  }: ListManualRecommendationsServiceRequest): Promise<RecommendationItem[]> {
    const recommendations =
      await this.productRecommendationRepository.listManualByEstablishment(
        establishmentId,
      );

    return recommendations.map((recommendation) => ({
      id: recommendation.id,
      source: recommendation.source,
      product: {
        id: recommendation.product.id,
        name: recommendation.product.name,
      },
      recommended_product: {
        id: recommendation.recommended_product.id,
        name: recommendation.recommended_product.name,
      },
    }));
  }
}
