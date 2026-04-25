import { makeBannerRepository } from "@/factories/repositories/make-banner-repository.js";
import { UpdateBannerService } from "@/services/banner/update-banner-service.js";

export const makeUpdateBannerService = () => {
  const bannerRepository = makeBannerRepository();
  return new UpdateBannerService(bannerRepository);
};
