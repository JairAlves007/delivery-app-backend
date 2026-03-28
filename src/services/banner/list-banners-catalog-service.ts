import z from "zod";

import { makeCache } from "@/factories/services/cache/make-cache.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.js";
import { establishmentParamsSchema } from "@/schemas/generic-schema.js";
import type { BannerFromRepository, BannerList } from "@/types/banner.js";

type ListBannersCatalogServiceRequest = z.infer<
	typeof establishmentParamsSchema
>;

interface ListBannersCatalogServiceResponse {
	banners: BannerList[];
}

export class ListBannersCatalogService {
	private bannerRepository: IBannerRepository;

	constructor(bannerRepository: IBannerRepository) {
		this.bannerRepository = bannerRepository;
	}

	private mapBanners(banners: BannerFromRepository[]): BannerList[] {
		return banners.map(banner => {
			return {
				...banner,
				resources: mapObjectResourcesList(banner.resources)
			};
		});
	}

	public async handle({
		establishmentId
	}: ListBannersCatalogServiceRequest): Promise<ListBannersCatalogServiceResponse> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey({
			establishment_id: establishmentId
		});
		const key = `${prefixKey}all_${cache.keys.banners}`;

		const banners = await cache.rememberForever(
			key,
			async () =>
				await this.bannerRepository.listAll({
					establishment_id: establishmentId
				})
		);

		if (banners.length <= 0) await cache.forget(key);

		return {
			banners: this.mapBanners(banners)
		};
	}
}
