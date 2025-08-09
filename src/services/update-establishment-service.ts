import { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository";
import { updateEstablishmentBodySchema } from "@/schemas/establishment-schema";
import z from "zod";

type DeleteEstablishmentRequest = z.infer<typeof updateEstablishmentBodySchema>;

export class UpdateEstablishmentService {
	constructor(private establishmentRepository: IEstablishmentRepository) {}

	async handle(id: string, data: DeleteEstablishmentRequest) {
		return await this.establishmentRepository.update(id, data);
	}
}
