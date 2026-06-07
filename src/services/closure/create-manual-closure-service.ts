import z from "zod";

import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import type { Closure } from "@/generated/prisma/client.js";
import type { IClosureRepository } from "@/interfaces/repositories/closure-repository.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { manualClosureBodySchema } from "@/schemas/closure-schema.js";

type CreateManualClosureServiceParams = z.infer<
	typeof manualClosureBodySchema
> & {
	establishmentId: string;
};

export class CreateManualClosureService {
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
		establishmentId,
		reason,
		endsAt
	}: CreateManualClosureServiceParams): Promise<Closure> {
		const establishment = await this.establishmentRepository.findById({
			id: establishmentId
		});

		if (!establishment) throw new EstablishmentNotFound();

		const closure = await this.closureRepository.create({
			establishment_id: establishmentId,
			starts_at: new Date(),
			ends_at: endsAt ?? null,
			reason: reason ?? null
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "establishments",
			paramsToForget: { establishment_id: establishmentId }
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "establishments",
			paramsToForget: { establishment_slug: establishment.slug }
		});

		return closure;
	}
}
