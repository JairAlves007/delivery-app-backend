import z from "zod";

import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateDistrictBodySchema } from "@/schemas/district-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

interface UpdateDistrictRequest
	extends
		z.infer<typeof updateDistrictBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
}

export class UpdateDistrictService {
	private districtRepository: IDistrictRepository;

	constructor(districtRepository: IDistrictRepository) {
		this.districtRepository = districtRepository;
	}

	async handle({
		id,
		establishmentId,
		shippingCost: shipping_cost,
		paramsToForget,
		...data
	}: UpdateDistrictRequest) {
		await this.districtRepository.update({
			id,
			data: {
				...data,
				shipping_cost,
				establishment: {
					connect: {
						id: establishmentId
					}
				}
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "districts",
			paramsToForget
		});
	}
}
