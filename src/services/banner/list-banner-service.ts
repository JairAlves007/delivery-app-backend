import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { BannerFromRepository, BannerList } from "@/types/banner.js";
import type { FilterField } from "@/types/crud.js";

type ListBannerServiceRequest = z.infer<typeof listQueryParamsSchema> &
	FilterField;

interface ListBannerServiceResponse extends Pick<
	ListBannerServiceRequest,
	"page"
> {
	banners: BannerList[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListBannerService {
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

	async handle({
		page,
		perPage,
		filterParams
	}: ListBannerServiceRequest): Promise<ListBannerServiceResponse> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey(filterParams);

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.banners}`,
			async () => await this.bannerRepository.count(filterParams)
		);

		if (isPaging) {
			const key = `${prefixKey}${cache.keys.banners}_page_${page}_per_page_${perPage}`;

			const [total, banners] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					key,
					async () =>
						await this.bannerRepository.paginate({
							page,
							perPage,
							filterParams
						})
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) {
				await cache.forget(key);
				throw new InvalidPage();
			}

			return {
				banners: this.mapBanners(banners),
				page,
				perPage,
				total,
				totalPages
			};
		}

		const [total, banners] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`${prefixKey}all_${cache.keys.banners}`,
				async () => await this.bannerRepository.listAll()
			)
		]);

		return {
			banners: this.mapBanners(banners),
			total
		};
	}
}
