import { EstablishmentPrismaRepository } from "@/repositories/establishment-prisma-repository";
import { updateEstablishmentBodySchema } from "@/schemas/establishment-schema";
import z from "zod";

type DeleteEstablishmentRequest = z.infer<typeof updateEstablishmentBodySchema>;

export class UpdateEstablishmentService {
	constructor(private establishmentRepository: EstablishmentPrismaRepository) {}

	async handle(id: string, data: DeleteEstablishmentRequest) {
		return await this.establishmentRepository.update(id, data);
	}
}
