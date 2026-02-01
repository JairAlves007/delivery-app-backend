import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
import { createDistrictBodySchema } from "@/schemas/district-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

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
