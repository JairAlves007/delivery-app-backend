import z from "zod";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import type { BannerFromRepository, BannerList } from "@/types/banner.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { mapObjectResourcesList } from "@/helpers/resource.ts";
import { establishmentParamsSchema } from "@/schemas/generic-schema.ts";

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
		const key = `${cache.keys.establishments}_${establishmentId}_${cache.keys.banners}`;

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
