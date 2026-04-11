import z from "zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import { establishmentParamsSchema } from "@/schemas/establishment-schema.js";
import type {
	EstablishmentFromRepository,
	EstablishmentsList
} from "@/types/establishment.js";

type FindEstablishmentByIdServiceRequest = z.infer<
	typeof establishmentParamsSchema
>;

export class FindEstablishmentByIdService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	private mapEstablishment(
		establishment: EstablishmentFromRepository
	): EstablishmentsList {
		return {
			...establishment,
			address: establishment.address?.address ?? null,
			resources: mapObjectResourcesList(establishment.resources)
		};
	}

	async handle({
		id
	}: FindEstablishmentByIdServiceRequest): Promise<EstablishmentsList> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey({
			establishment_id: id
		});
		const key = `${prefixKey}${cache.keys.establishments}`;

		const establishment = await cache.rememberForever(
			key,
			async () => await this.establishmentRepository.findById({ id })
		);

		if (!establishment) throw new EstablishmentNotFound();

		return this.mapEstablishment(establishment);
	}
}
