import z from "zod";

import { AddonNotFound } from "@/errors/addon/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.js";
import { addonParamsSchema } from "@/schemas/addon-schema.js";
import type { AddonFromRepository } from "@/types/addon.js";
import type { FilterField } from "@/types/crud.js";

type FindAddonServiceRequest = z.infer<typeof addonParamsSchema> & FilterField;

export class FindAddonService {
	private addonRepository: IAddonRepository;

	constructor(addonRepository: IAddonRepository) {
		this.addonRepository = addonRepository;
	}

	async handle({
		id,
		filterParams
	}: FindAddonServiceRequest): Promise<AddonFromRepository> {
		const cache = makeCache();
		const filterPrefixKey = getFilterParamsCacheKey(filterParams);

		const key = `${filterPrefixKey}${cache.keys.addons}_${id}`;

		const addon = await cache.remember(
			key,
			Constants.CACHE_TTL.addons,
			async () => await this.addonRepository.findById({ id, filterParams })
		);

		if (!addon) throw new AddonNotFound();

		return addon;
	}
}
