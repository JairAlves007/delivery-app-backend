import { makeBannerRepository } from "@/factories/repositories/make-banner-repository.ts";
import { CreateBannerService } from "@/services/banner/create-banner-service.ts";

export const makeCreateBannerService = () => {
	const bannerRepository = makeBannerRepository();
	return new CreateBannerService(bannerRepository);
};
