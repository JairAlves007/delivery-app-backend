import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type DeleteBannerServiceParams = {
	id: number;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteBannerService {
	private bannerRepository: IBannerRepository;

	constructor(bannerRepository: IBannerRepository) {
		this.bannerRepository = bannerRepository;
	}

	async handle({ id, paramsToForget }: DeleteBannerServiceParams) {
		await this.bannerRepository.delete({ id, force: false });

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "banners",
			paramsToForget
		});
	}
}
