import { makeBannerRepository } from "@/factories/repositories/make-banner-repository.ts";
import { FindBannerService } from "@/services/banner/find-banner-service.ts";

export const makeFindBannerService = () => {
	const bannerRepository = makeBannerRepository();

	return new FindBannerService(bannerRepository);
};
