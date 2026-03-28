import { ResourcePrismaRepository } from "@/repositories/resource-prisma-repository.js";

export const makeResourceRepository = () => {
	return new ResourcePrismaRepository();
};
