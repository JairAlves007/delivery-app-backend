import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
import { updateAddonBodySchema } from "@/schemas/addon-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

interface UpdateAddonServiceRequest
	extends
		z.infer<typeof updateAddonBodySchema>,
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

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "addons",
			paramsToForget
		});
	}
}
