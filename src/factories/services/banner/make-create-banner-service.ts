import { makeBannerRepository } from "@/factories/repositories/make-banner-repository.js";
import { CreateBannerService } from "@/services/banner/create-banner-service.js";

export const makeCreateBannerService = () => {
	const bannerRepository = makeBannerRepository();
	return new CreateBannerService(bannerRepository);
};
