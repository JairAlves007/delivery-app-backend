import { makeBannerRepository } from "@/factories/repositories/make-banner-repository.js";
import { ListBannerService } from "@/services/banner/list-banner-service.js";

export const makeListBannerService = () => {
	const bannerRepository = makeBannerRepository();
	return new ListBannerService(bannerRepository);
};
