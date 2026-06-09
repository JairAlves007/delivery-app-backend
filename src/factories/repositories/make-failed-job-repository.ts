import { FailedJobPrismaRepository } from "@/repositories/failed-job-prisma-repository.js";

export const makeFailedJobRepository = () => {
  return new FailedJobPrismaRepository();
};
