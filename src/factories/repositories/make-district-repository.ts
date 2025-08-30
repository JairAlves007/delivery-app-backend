import { DistrictPrismaRepository } from "@/repositories/district-prisma-repository.ts";

export const makeDistrictRepository = () => {
	return new DistrictPrismaRepository();
};
