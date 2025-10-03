import { BannerNotFound } from "@/errors/banner/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import { bannerParamsSchema } from "@/schemas/banner-schema.ts";
import type { BannerFromRepository } from "@/types/banner.ts";
import z from "zod";

type FindBannerServiceRequest = z.infer<typeof bannerParamsSchema>;

export class FindBannerService {
	private bannerRepository: IBannerRepository;

	constructor(bannerRepository: IBannerRepository) {
		this.bannerRepository = bannerRepository;
	}

	async handle({
		id
	}: FindBannerServiceRequest): Promise<BannerFromRepository> {
		const cache = makeCache();
		const key = `${cache.keys.banners}_${id}`;

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
