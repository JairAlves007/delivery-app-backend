import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";

export class DeleteDistrictService {
	private districtRepository: IDistrictRepository;

	constructor(districtRepository: IDistrictRepository) {
		this.districtRepository = districtRepository;
	}

	async handle(id: number) {
		await this.districtRepository.delete(id, true);
	}
}
