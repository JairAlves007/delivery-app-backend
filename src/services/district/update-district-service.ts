import z from "zod";

import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateDistrictBodySchema } from "@/schemas/district-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

interface UpdateDistrictRequest
	extends
		z.infer<typeof updateDistrictBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
	establishmentId: EstablishmentID;
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
			filterParams: { establishment_id: establishmentId },
			data: {
				...data,
				shipping_cost
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "districts",
			paramsToForget
		});
	}
}
