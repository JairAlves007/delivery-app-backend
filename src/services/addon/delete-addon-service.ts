import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";

export class DeleteAddonService {
	private addonRepository: IAddonRepository;

	constructor(addonRepository: IAddonRepository) {
		this.addonRepository = addonRepository;
	}

	async handle(id: number) {
		const cache = makeCache();

		await this.addonRepository.delete(id, false);

		await cache.forgetKeysContaining(cache.keys.addons);
	}
}
