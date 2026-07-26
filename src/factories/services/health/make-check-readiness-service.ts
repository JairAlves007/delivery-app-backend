import { makeCache } from "@/factories/services/cache/make-cache.js";
import { CheckReadinessService } from "@/services/health/check-readiness-service.js";

export const makeCheckReadinessService = () => {
  const cache = makeCache();

  return new CheckReadinessService(cache);
};
