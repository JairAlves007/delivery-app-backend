import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type DeleteAddonParams = {
	id: number;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteAddonService {
	private addonRepository: IAddonRepository;

	constructor(addonRepository: IAddonRepository) {
		this.addonRepository = addonRepository;
	}

	async handle({ id, paramsToForget }: DeleteAddonParams) {
		await this.addonRepository.delete({
			id,
			force: false
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "addons",
			paramsToForget
		});
	}
}
