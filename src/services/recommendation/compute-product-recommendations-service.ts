import Constants from "@/helpers/constants.js";
import type { IProductRecommendationRepository } from "@/interfaces/repositories/product-recommendation-repository.js";
import type { CoOccurrenceRow } from "@/types/recommendation.js";

export class ComputeProductRecommendationsService {
  private productRecommendationRepository: IProductRecommendationRepository;

  constructor(
    productRecommendationRepository: IProductRecommendationRepository,
  ) {
    this.productRecommendationRepository = productRecommendationRepository;
  }

  async handle(): Promise<{ count: number }> {
    const rows =
      await this.productRecommendationRepository.computeCoOccurrences();

    const grouped = new Map<string, CoOccurrenceRow[]>();

    for (const row of rows) {
      const key = `${row.establishment_id}|${row.product_id}`;
      const list = grouped.get(key);
      if (list) list.push(row);
      else grouped.set(key, [row]);
    }

    const topRows: CoOccurrenceRow[] = [];

    for (const list of grouped.values()) {
      list.sort((a, b) => b.score - a.score);
      topRows.push(
        ...list.slice(0, Constants.RECOMMENDATION_MAX_PER_PRODUCT),
      );
    }

    await this.productRecommendationRepository.replaceAutoRecommendations(
      topRows,
    );

    return { count: topRows.length };
  }
}
