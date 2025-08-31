import { AddonPrismaRepository } from "@/repositories/addon-prisma-repository.ts";

export const makeAddonRepository = () => {
	return new AddonPrismaRepository();
};
