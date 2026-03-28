import { BannerPrismaRepository } from "@/repositories/banner-prisma-repository.js";

export const makeBannerRepository = () => {
	return new BannerPrismaRepository();
};
