import { makeQueue } from "@/factories/services/queue/make-queue.js";
import Constants from "@/helpers/constants.js";

export const recommendationQueueName = "recommendation-queue";

export const scheduleComputeRecommendations = async () => {
  const queue = makeQueue<Record<string, never>>(recommendationQueueName);

  await queue.scheduleRepeatable({
    schedulerId: Constants.RECOMMENDATION_SCHEDULER_ID,
    pattern: Constants.RECOMMENDATION_CRON,
    tz: Constants.DASHBOARD_TIMEZONE,
    job: { name: "compute-product-recommendations", data: {} },
  });
};
