import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import type { Establishment } from "@prisma/client";

export class FindEstablishmentBySlugService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle(slug: string): Promise<Establishment> {
		const cache = makeCache();

		const establishment = await cache.rememberForever(
			`${cache.keys.establishments}_${slug}`,
			async () => await this.establishmentRepository.findBySlug(slug)
		);

		if (!establishment) throw new EstablishmentNotFound();

		return establishment;
	}
}
