import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { establishmentParamsSchema } from "@/schemas/establishment-schema.ts";
import type { EstablishmentFromRepository } from "@/types/establishment.ts";
import z from "zod";

type FindEstablishmentByIdServiceRequest = z.infer<
	typeof establishmentParamsSchema
>;

export class FindEstablishmentByIdService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle({
		id
	}: FindEstablishmentByIdServiceRequest): Promise<EstablishmentFromRepository> {
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

		return establishment;
	}
}
