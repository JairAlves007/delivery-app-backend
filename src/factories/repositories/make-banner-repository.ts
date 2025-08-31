import { BannerPrismaRepository } from "@/repositories/banner-prisma-repository.ts";

export const makeBannerRepository = () => {
	return new BannerPrismaRepository();
};
