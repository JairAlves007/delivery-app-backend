import type { IAddonRepository } from "@/interfaces/repositories/addon-repository.ts";

export class DeleteAddonService {
	private addonRepository: IAddonRepository;

	constructor(addonRepository: IAddonRepository) {
		this.addonRepository = addonRepository;
	}

	async handle(id: number) {
		await this.addonRepository.delete(id, false);
	}
}
