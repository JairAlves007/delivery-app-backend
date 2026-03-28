import z from "zod";

import { slugify } from "@/helpers/utils.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import { createMenuForNewEstablishmentQueue } from "@/queues/establishment-queue.js";
import { createEstablishmentBodySchema } from "@/schemas/establishment-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type CreateEstablishmentServiceParams = z.infer<
	typeof createEstablishmentBodySchema
> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle({
		name,
		address: { postalCode: postal_code, ...address },
		acceptsCreditCard: accepts_credit_card,
		onlyDelivery: only_delivery,
		nextBillingDate: next_billing_date,
		paramsToForget,
		...data
	}: CreateEstablishmentServiceParams): Promise<void> {
		const establishment = await this.establishmentRepository.create({
			...data,
			name,
			slug: slugify(name),
			accepts_credit_card,
			only_delivery,
			next_billing_date,
			address: {
				create: {
					address: {
						create: {
							...address,
							postal_code
						}
					}
				}
			}
		});

		await createMenuForNewEstablishmentQueue({
			establishmentId: establishment.id,
			paramsToForget
		});
	}
}
