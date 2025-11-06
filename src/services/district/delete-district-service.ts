import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";

type DeleteDistrictParams = {
	id: string;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteDistrictService {
	private districtRepository: IDistrictRepository;

	constructor(districtRepository: IDistrictRepository) {
		this.districtRepository = districtRepository;
	}

	async handle({ id, paramsToForget }: DeleteDistrictParams) {
		await this.districtRepository.delete({ id, force: false });

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "districts",
			paramsToForget
		});
	}
}
