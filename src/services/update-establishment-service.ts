import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";
import { updateEstablishmentBodySchema } from "@/schemas/establishment-schema.ts";
import z from "zod";

type DeleteEstablishmentRequest = z.infer<typeof updateEstablishmentBodySchema>;

export class UpdateEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	async handle(id: string, data: DeleteEstablishmentRequest) {
		return await this.establishmentRepository.update(id, data);
	}
}
