import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import type { IClosureRepository } from "@/interfaces/repositories/closure-repository.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";

type ReopenEstablishmentServiceParams = {
	establishmentId: string;
};

export class ReopenEstablishmentService {
	private closureRepository: IClosureRepository;
	private establishmentRepository: IEstablishmentRepository;

	constructor(
		closureRepository: IClosureRepository,
		establishmentRepository: IEstablishmentRepository
	) {
		this.closureRepository = closureRepository;
		this.establishmentRepository = establishmentRepository;
	}

	async handle({
		establishmentId
	}: ReopenEstablishmentServiceParams): Promise<{ endedCount: number }> {
		const establishment = await this.establishmentRepository.findById({
			id: establishmentId
		});

		if (!establishment) throw new EstablishmentNotFound();

		const endedCount = await this.closureRepository.endActiveClosures({
			establishmentId,
			now: new Date()
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "establishments",
			paramsToForget: { establishment_id: establishmentId }
		});

		return { endedCount };
	}
}
