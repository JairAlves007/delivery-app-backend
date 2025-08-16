import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { updateEstablishmentBodySchema } from "@/schemas/establishment-schema.ts";
import z from "zod";

type UpdateEstablishmentRequest = z.infer<typeof updateEstablishmentBodySchema>;

export class UpdateEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle(id: string, data: UpdateEstablishmentRequest) {
		return await this.establishmentRepository.update(id, data);
	}
}
