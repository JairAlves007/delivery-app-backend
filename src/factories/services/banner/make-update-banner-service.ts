import { makeBannerRepository } from "@/factories/repositories/make-banner-repository.ts";
import { UpdateBannerService } from "@/services/banner/update-banner-service.ts";

export const makeUpdateBannerService = () => {
	const bannerRepository = makeBannerRepository();
	return new UpdateBannerService(bannerRepository);
};
