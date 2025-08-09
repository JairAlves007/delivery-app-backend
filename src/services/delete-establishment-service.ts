import { EstablishmentPrismaRepository } from "@/repositories/establishment-prisma-repository";

export class DeleteEstablishmentService {
	constructor(private establishmentRepository: EstablishmentPrismaRepository) {}

	public async handle(id: string) {
		await this.establishmentRepository.delete(id);
	}
}
