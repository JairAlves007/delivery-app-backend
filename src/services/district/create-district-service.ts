import z from "zod";

import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createDistrictBodySchema } from "@/schemas/district-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type CreateDistrictServiceRequest = z.infer<typeof createDistrictBodySchema> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateDistrictService {
	private districtRepository: IDistrictRepository;

	constructor(districtRepository: IDistrictRepository) {
		this.districtRepository = districtRepository;
	}

	async handle({
		establishmentId,
		shippingCost: shipping_cost,
		paramsToForget,
		...data
	}: CreateDistrictServiceRequest) {
		await this.districtRepository.create({
			...data,
			shipping_cost,
			establishment: {
				connect: {
					id: establishmentId
				}
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "districts",
			paramsToForget
		});
	}
}
