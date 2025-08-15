import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.ts";

export class DeleteEstablishmentService {
	private establishmentRepository: IEstablishmentRepository;

	constructor(establishmentRepository: IEstablishmentRepository) {
		this.establishmentRepository = establishmentRepository;
	}

	public async handle(id: string) {
		await this.establishmentRepository.delete(id, false);
	}
}
