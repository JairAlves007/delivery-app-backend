import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import type { EstablishmentFromRepository } from "@/types/establishment.ts";

export class FindEstablishmentBySlugService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle(slug: string): Promise<EstablishmentFromRepository> {
		const cache = makeCache();
		const key = `${cache.keys.establishments}_${slug}`;

		const establishment = await cache.rememberForever(
			key,
			async () => await this.establishmentRepository.findBySlug(slug)
		);

		if (!establishment) throw new EstablishmentNotFound();

		return establishment;
	}
}
