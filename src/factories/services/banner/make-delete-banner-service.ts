import { makeBannerRepository } from "@/factories/repositories/make-banner-repository.js";
import { DeleteBannerService } from "@/services/banner/delete-banner-service.js";

export const makeDeleteBannerService = () => {
	const bannerRepository = makeBannerRepository();
	return new DeleteBannerService(bannerRepository);
};
