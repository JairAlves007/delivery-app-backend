import { AddonNotFound } from "@/errors/addon/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";
import { addonParamsSchema } from "@/schemas/addon-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import type { Addon } from "@prisma/client";
import z from "zod";

type FindAddonServiceRequest = z.infer<typeof addonParamsSchema> & FilterField;

export class FindAddonService {
	private addonRepository: IAddonRepository;

	constructor(addonRepository: IAddonRepository) {
		this.addonRepository = addonRepository;
	}

	async handle({ id, filterParams }: FindAddonServiceRequest): Promise<Addon> {
		const cache = makeCache();
		const filterPrefixKey = getFilterParamsCacheKey(filterParams);

		const key = `${filterPrefixKey}${cache.keys.addons}_${id}`;

		const addon = await cache.rememberForever(
			key,
			async () => await this.addonRepository.findById({ id })
		);

		if (!addon) {
			await cache.forget(key);
			throw new AddonNotFound();
		}

		return addon;
	}
}
