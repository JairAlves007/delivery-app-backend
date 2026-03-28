import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

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

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "districts",
			paramsToForget
		});
	}
}
