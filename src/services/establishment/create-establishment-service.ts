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
		logo_image_key,
		description,
		phone,
		cnpj,
		accepts_credit_card,
		only_delivery
	}: z.infer<typeof createEstablishmentBodySchema>): Promise<void> {
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
			only_delivery
		});
	}
}
