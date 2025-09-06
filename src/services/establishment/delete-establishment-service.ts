import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";

export class DeleteEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	public async handle(id: string) {
		const cache = makeCache();

		await this.establishmentRepository.delete(id, false);

		await cache.forgetKeysContaining(cache.keys.establishments);
	}
}
