import z from "zod";

import { BannerNotFound } from "@/errors/banner/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.js";
import { bannerParamsSchema } from "@/schemas/banner-schema.js";
import type { BannerFromRepository } from "@/types/banner.js";
import type { FilterField } from "@/types/crud.js";

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
			async () => await this.bannerRepository.findById({ id, filterParams })
		);

		if (!banner) throw new BannerNotFound();

		return banner;
	}
}
