import { slugify } from "@/helpers/utils";
import { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository";
import { createEstablishmentBodySchema } from "@/schemas/establishment-schema";
import { Prisma } from "@prisma/client";
import z from "zod";

type CreateEstablishmentServiceRequest = z.infer<
	typeof createEstablishmentBodySchema
>;

export class CreateEstablishmentService {
	constructor(private establishmentRepository: IEstablishmentRepository) {}

	async handle({
		name,
		email,
		address,
		description,
		phone,
		cnpj,
		accepts_credit_card,
		only_delivery
	}: CreateEstablishmentServiceRequest): Promise<void> {
		const data: Prisma.EstablishmentCreateInput = {
			name,
			slug: slugify(name),
			logo_url: "https://avatar.iran.liara.run/public/17",
			email,
			address,
			description,
			phone,
			cnpj,
			accepts_credit_card,
			only_delivery
		};

		await this.establishmentRepository.create(data);
	}
}
