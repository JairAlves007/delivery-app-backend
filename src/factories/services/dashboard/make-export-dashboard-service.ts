import { makeGetDashboardService } from "@/factories/services/dashboard/make-get-dashboard-service.js";
import { ExportDashboardService } from "@/services/dashboard/export-dashboard-service.js";

export const makeExportDashboardService = () => {
  const getDashboardService = makeGetDashboardService();

  return new ExportDashboardService(getDashboardService);
};
