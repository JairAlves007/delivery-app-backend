import type { IAddressRepository } from "@/interfaces/repositories/address-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type DeleteAddressServiceParams = {
	id: string;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteAddressService {
	private addressRepository: IAddressRepository;

	constructor(addressRepository: IAddressRepository) {
		this.addressRepository = addressRepository;
	}

	async handle({
		id,
		paramsToForget
	}: DeleteAddressServiceParams): Promise<void> {
		await this.addressRepository.delete({ id, force: false });

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "addresses",
			paramsToForget
		});
	}
}
