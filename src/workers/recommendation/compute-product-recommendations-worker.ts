import { makeQueue } from "@/factories/services/queue/make-queue.js";
import { makeComputeProductRecommendationsService } from "@/factories/services/recommendation/make-compute-product-recommendations-service.js";
import { app } from "@/http/app.js";
import { recommendationQueueName } from "@/queues/recommendation-queue.js";

export const setupComputeProductRecommendationsWorker = () => {
  const recommendationQueue = makeQueue<Record<string, never>>(
    recommendationQueueName,
  );

  recommendationQueue.registerProcessor(async () => {
    const computeProductRecommendationsService =
      makeComputeProductRecommendationsService();

    const { count } = await computeProductRecommendationsService.handle();

    app.log.info(
      { count },
      "[Recommendation] product recommendations computed",
    );
  });
};
