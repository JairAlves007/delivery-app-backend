import { makeBannerRepository } from "@/factories/repositories/make-banner-repository.ts";
import { ListBannersCatalogService } from "@/services/banner/list-banners-catalog-service.ts";

export const makeListBannersCatalogService = () => {
	const bannerRepository = makeBannerRepository();
	return new ListBannersCatalogService(bannerRepository);
};
