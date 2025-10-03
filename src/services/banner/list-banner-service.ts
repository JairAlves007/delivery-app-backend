import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { mapObjectResourcesList } from "@/helpers/resource.ts";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { BannerFromRepository, BannerList } from "@/types/banner.ts";
import z from "zod";

type ListBannerServiceRequest = z.infer<typeof listQueryParamsSchema>;

interface ListBannerServiceResponse
	extends Pick<ListBannerServiceRequest, "page"> {
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
		establishmentId
	}: ListBannerServiceRequest): Promise<ListBannerServiceResponse> {
		const cache = makeCache();
		const prefixKey = !!establishmentId ? `${establishmentId}_` : "";

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.banners}`,
			async () =>
				await this.bannerRepository.count({ establishment_id: establishmentId })
		);

		if (isPaging) {
			const [total, banners] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`${prefixKey}${cache.keys.banners}_page_${page}_per_page_${perPage}`,
					async () =>
						await this.bannerRepository.paginate({
							page,
							perPage,
							filterParams: { establishment_id: establishmentId }
						})
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) throw new InvalidPage();

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
				async () =>
					await this.bannerRepository.listAll({
						establishment_id: establishmentId
					})
			)
		]);

		return {
			banners: this.mapBanners(banners),
			page,
			total
		};
	}
}
