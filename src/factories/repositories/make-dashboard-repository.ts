import { DashboardPrismaRepository } from "@/repositories/dashboard-prisma-repository.js";

export const makeDashboardRepository = () => {
  return new DashboardPrismaRepository();
};
