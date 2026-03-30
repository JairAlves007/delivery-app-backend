import z from "zod";

import { makeSetAllAddressesAsNotDefaultService } from "@/factories/services/address/user/make-set-all-addresses-as-not-default-service.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createAddressBodySchema } from "@/schemas/address-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { UserID } from "@/types/user.js";

type CreateAddressServiceRequest = z.infer<typeof createAddressBodySchema> & {
	userId: UserID;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateAddressService {
	private addressRepository: IAddressRepository;

	constructor(addressRepository: IAddressRepository) {
		this.addressRepository = addressRepository;
	}

	async handle({
		referencePoint: reference_point,
		postalCode: postal_code,
		isDefault: is_default,
		paramsToForget,
		userId,
		...data
	}: CreateAddressServiceRequest): Promise<void> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey({ user_id: userId });
		const countKey = `${prefixKey}${cache.keys.addresses}`;

		const count = await cache.remember(
			countKey,
			Constants.CACHE_TTL.addresses,
			async () => await this.addressRepository.count({ user_id: userId })
		);

		if (count <= 0) is_default = true;

		if (is_default && count > 0) {
			const setAllAsNotDefaultService =
				makeSetAllAddressesAsNotDefaultService();

			await setAllAsNotDefaultService.handle(userId);
		}

		await this.addressRepository.create({
			is_default,
			address: {
				create: {
					...data,
					reference_point,
					postal_code
				}
			},
			user: {
				connect: {
					id: userId
				}
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "addresses",
			paramsToForget
		});
	}
}
