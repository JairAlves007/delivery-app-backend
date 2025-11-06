import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import type { EstablishmentID } from "@/types/establishment.ts";

type CreateMenuForNewEstablishmentParams = {
	establishmentId: EstablishmentID;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateMenuForNewEstablishmentService {
	private menuRepository: IMenuRepository;

	constructor(menuRepository: IMenuRepository) {
		this.menuRepository = menuRepository;
	}

	async handle({
		establishmentId,
		paramsToForget
	}: CreateMenuForNewEstablishmentParams) {
		await this.menuRepository.createForNewEstablishment(establishmentId);

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "menus",
			paramsToForget
		});
	}
}
