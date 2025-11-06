import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";
import { updateDistrictBodySchema } from "@/schemas/district-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

interface UpdateDistrictRequest
	extends z.infer<typeof updateDistrictBodySchema>,
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

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "districts",
			paramsToForget
		});
	}
}
