import { DistrictPrismaRepository } from "@/repositories/district-prisma-repository.js";

export const makeDistrictRepository = () => {
  return new DistrictPrismaRepository();
};
