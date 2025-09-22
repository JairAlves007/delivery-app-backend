import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";

export class DeleteAddressService {
	private addressRepository: IAddressRepository;

	constructor(addressRepository: IAddressRepository) {
		this.addressRepository = addressRepository;
	}

	async handle(id: string): Promise<void> {
		const cache = makeCache();

		await this.addressRepository.delete({ id, force: false });

		await cache.forgetKeysContaining(cache.keys.addresses);
	}
}
