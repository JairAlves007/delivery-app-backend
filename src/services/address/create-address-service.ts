import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { makeSetAllAddressesAsNotDefaultService } from "@/factories/services/address/user/make-set-all-addresses-as-not-default-service.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import { createAddressBodySchema } from "@/schemas/address-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import type { UserID } from "@/types/user.ts";
import z from "zod";

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

		const count = await cache.rememberForever(
			countKey,
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

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "addresses",
			paramsToForget
		});
	}
}
