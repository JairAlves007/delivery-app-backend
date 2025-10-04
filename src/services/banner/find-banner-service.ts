import { BannerNotFound } from "@/errors/banner/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import { bannerParamsSchema } from "@/schemas/banner-schema.ts";
import type { BannerFromRepository } from "@/types/banner.ts";
import type { FilterField } from "@/types/crud.ts";
import z from "zod";

type FindBannerServiceRequest = z.infer<typeof bannerParamsSchema> &
	FilterField;

export class FindBannerService {
	private bannerRepository: IBannerRepository;

	constructor(bannerRepository: IBannerRepository) {
		this.bannerRepository = bannerRepository;
	}

	async handle({
		id,
		filterParams
	}: FindBannerServiceRequest): Promise<BannerFromRepository> {
		const cache = makeCache();
		const filterPrefixKey = getFilterParamsCacheKey(filterParams);
		const key = `${filterPrefixKey}${cache.keys.banners}_${id}`;

		const banner = await cache.rememberForever(
			key,
			async () => await this.bannerRepository.findById({ id })
		);

		if (!banner) {
			await cache.forget(key);
			throw new BannerNotFound();
		}

		return banner;
	}
}
