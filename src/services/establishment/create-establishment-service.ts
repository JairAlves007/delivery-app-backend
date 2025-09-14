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
		email,
		address,
		logoImageKey: logo_image_key,
		description,
		phone,
		cnpj,
		acceptsCreditCard: accepts_credit_card,
		onlyDelivery: only_delivery,
		nextBillingDate: next_billing_date
	}: z.infer<typeof createEstablishmentBodySchema>): Promise<void> {
		const cache = makeCache();

		await this.establishmentRepository.create({
			name,
			slug: slugify(name),
			logo_image_key,
			email,
			address,
			description,
			phone,
			cnpj,
			accepts_credit_card,
			only_delivery,
			next_billing_date
		});

		await cache.forgetKeysContaining(cache.keys.establishments);
	}
}
