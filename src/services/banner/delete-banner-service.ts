import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";

export class DeleteBannerService {
	private bannerRepository: IBannerRepository;

	constructor(bannerRepository: IBannerRepository) {
		this.bannerRepository = bannerRepository;
	}

	async handle(id: number) {
		const cache = makeCache();

		await this.bannerRepository.delete({ id, force: false });

		await cache.forgetKeysContaining(cache.keys.banners);
	}
}
