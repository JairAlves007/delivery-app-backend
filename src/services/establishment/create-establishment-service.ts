import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { slugify } from "@/helpers/utils.ts";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { createEstablishmentBodySchema } from "@/schemas/establishment-schema.ts";
import z from "zod";

export class CreateEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle({
		name,
		address: { postalCode: postal_code, ...address },
		logoImageKey: logo_image_key,
		acceptsCreditCard: accepts_credit_card,
		onlyDelivery: only_delivery,
		nextBillingDate: next_billing_date,
		...data
	}: z.infer<typeof createEstablishmentBodySchema>): Promise<void> {
		const cache = makeCache();

		await this.establishmentRepository.create({
			...data,
			name,
			slug: slugify(name),
			logo_image_key,
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

		await cache.forgetKeysContaining(cache.keys.establishments);
	}
}
