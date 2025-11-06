import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";

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

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "banners",
			paramsToForget
		});
	}
}
