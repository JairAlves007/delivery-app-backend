import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";
import { createDistrictBodySchema } from "@/schemas/district-schema.ts";
import z from "zod";

type CreateDistrictServiceRequest = z.infer<typeof createDistrictBodySchema>;

export class CreateDistrictService {
	private districtRepository: IDistrictRepository;

	constructor(districtRepository: IDistrictRepository) {
		this.districtRepository = districtRepository;
	}

	async handle({
		establishmentId,
		shippingCost: shipping_cost,
		...data
	}: CreateDistrictServiceRequest) {
		const cache = makeCache();

		await this.districtRepository.create({
			...data,
			shipping_cost,
			establishment: {
				connect: {
					id: establishmentId
				}
			}
		});

		await cache.forgetKeysContaining(cache.keys.districts);
	}
}
