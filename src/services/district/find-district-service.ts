import { DistrictNotFound } from "@/errors/district/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";
import { districtParamsSchema } from "@/schemas/district-schema.ts";
import type { District } from "@prisma/client";
import z from "zod";

type FindDistrictServiceRequest = z.infer<typeof districtParamsSchema>;

export class FindDistrictService {
	private districtRepository: IDistrictRepository;

	constructor(districtRepository: IDistrictRepository) {
		this.districtRepository = districtRepository;
	}

	async handle({ id }: FindDistrictServiceRequest): Promise<District> {
		const cache = makeCache();
		const key = `${cache.keys.districts}_${id}`;

		const district = await cache.rememberForever(
			key,
			async () => await this.districtRepository.findById({ id })
		);

		if (!district) {
			await cache.forget(key);
			throw new DistrictNotFound();
		}

		return district;
	}
}
