import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";
import { updateAddonBodySchema } from "@/schemas/addon-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

interface UpdateAddonServiceRequest
	extends z.infer<typeof updateAddonBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: number;
}

export class UpdateAddonService {
	private addonRepository: IAddonRepository;

	constructor(addonRepository: IAddonRepository) {
		this.addonRepository = addonRepository;
	}

	async handle({
		id,
		categoryId,
		paramsToForget,
		...data
	}: UpdateAddonServiceRequest) {
		await this.addonRepository.update({
			id,
			data: {
				...data,
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		});

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "addons",
			paramsToForget
		});
	}
}
