import { AddonPrismaRepository } from "@/repositories/addon-prisma-repository.js";

export const makeAddonRepository = () => {
	return new AddonPrismaRepository();
};
