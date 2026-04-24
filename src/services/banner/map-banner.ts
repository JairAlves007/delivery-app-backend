import { mapObjectResourcesList } from "@/helpers/resource.js";
import type { BannerFromRepository, BannerList } from "@/types/banner.js";

export const mapBanner = (banner: BannerFromRepository): BannerList => ({
	...banner,
	resources: mapObjectResourcesList(banner.resources)
});

export const mapBanners = (banners: BannerFromRepository[]): BannerList[] =>
	banners.map(mapBanner);
