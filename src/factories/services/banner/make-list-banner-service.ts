import { makeBannerRepository } from "@/factories/repositories/make-banner-repository.ts";
import { ListBannerService } from "@/services/banner/list-banner-service.ts";

export const makeListBannerService = () => {
	const bannerRepository = makeBannerRepository();
	return new ListBannerService(bannerRepository);
};
