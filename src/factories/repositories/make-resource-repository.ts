import { ResourcePrismaRepository } from "@/repositories/resource-prisma-repository.ts";

export const makeResourceRepository = () => {
	return new ResourcePrismaRepository();
};
