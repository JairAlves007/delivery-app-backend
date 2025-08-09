import { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository";

export class DeleteEstablishmentService {
	constructor(private establishmentRepository: IEstablishmentRepository) {}

	public async handle(id: string) {
		await this.establishmentRepository.delete(id, false);
	}
}
