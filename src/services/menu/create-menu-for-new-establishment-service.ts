import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.ts";
import type { EstablishmentID } from "@/types/establishment.ts";

export class CreateMenuForNewEstablishmentService {
	private menuRepository: IMenuRepository;

	constructor(menuRepository: IMenuRepository) {
		this.menuRepository = menuRepository;
	}

	async handle(establishmentId: EstablishmentID) {
		await this.menuRepository.createForNewEstablishment(establishmentId);
	}
}
