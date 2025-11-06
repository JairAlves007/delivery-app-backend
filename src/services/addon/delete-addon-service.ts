import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";

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

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "addons",
			paramsToForget
		});
	}
}
