import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import { paginationQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { Banner } from "@prisma/client";
import z from "zod";

type ListBannerServiceRequest = z.infer<typeof paginationQueryParamsSchema>;

interface ListBannerServiceResponse
	extends Pick<ListBannerServiceRequest, "page"> {
	banners: Banner[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListBannerService {
	private bannerRepository: IBannerRepository;

	constructor(bannerRepository: IBannerRepository) {
		this.bannerRepository = bannerRepository;
	}

	async handle({
		page,
		perPage
	}: ListBannerServiceRequest): Promise<ListBannerServiceResponse> {
		const cache = makeCache();

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`total_${cache.keys.banners}`,
			async () => await this.bannerRepository.count()
		);

		if (isPaging) {
			const [total, banners] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					`${cache.keys.banners}_page_${page}_per_page_${perPage}`,
					async () => await this.bannerRepository.paginate(page, perPage)
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) throw new InvalidPage();

			return {
				banners,
				page,
				perPage,
				total,
				totalPages
			};
		}

		const [total, banners] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`all_${cache.keys.banners}`,
				async () => await this.bannerRepository.listAll()
			)
		]);

		return {
			banners,
			page,
			total
		};
	}
}
