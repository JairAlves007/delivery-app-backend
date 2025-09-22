import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.ts";

export class DeleteDistrictService {
	private districtRepository: IDistrictRepository;

	constructor(districtRepository: IDistrictRepository) {
		this.districtRepository = districtRepository;
	}

	async handle(id: string) {
		const cache = makeCache();

		await this.districtRepository.delete({ id, force: false });

		await cache.forgetKeysContaining(cache.keys.districts);
	}
}
