import { makeDashboardRepository } from "@/factories/repositories/make-dashboard-repository.js";
import { GetDashboardService } from "@/services/dashboard/get-dashboard-service.js";

export const makeGetDashboardService = () => {
  const dashboardRepository = makeDashboardRepository();
  return new GetDashboardService(dashboardRepository);
};
