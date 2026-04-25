import { makeBannerRepository } from "@/factories/repositories/make-banner-repository.js";
import { FindBannerService } from "@/services/banner/find-banner-service.js";

export const makeFindBannerService = () => {
  const bannerRepository = makeBannerRepository();

  return new FindBannerService(bannerRepository);
};
