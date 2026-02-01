import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
import { createAddonBodySchema } from "@/schemas/addon-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

type CreateAddonServiceRequest = z.infer<typeof createAddonBodySchema> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateAddonService {
	private addonRepository: IAddonRepository;

	constructor(addonRepository: IAddonRepository) {
		this.addonRepository = addonRepository;
	}

	async handle({
		categoryId,
		paramsToForget,
		...data
	}: CreateAddonServiceRequest) {
		await this.addonRepository.create({
			...data,
			category: {
				connect: {
					id: categoryId
				}
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "addons",
			paramsToForget
		});
	}
}
