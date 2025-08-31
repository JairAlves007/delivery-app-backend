import { makeBannerRepository } from "@/factories/repositories/make-banner-repository.ts";
import { DeleteBannerService } from "@/services/banner/delete-banner-service.ts";

export const makeDeleteBannerService = () => {
	const bannerRepository = makeBannerRepository();
	return new DeleteBannerService(bannerRepository);
};
