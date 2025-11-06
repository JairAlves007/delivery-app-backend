import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { makeSetAllAddressesAsNotDefaultService } from "@/factories/services/address/user/make-set-all-addresses-as-not-default-service.ts";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import { updateAddressBodySchema } from "@/schemas/address-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import type { UserID } from "@/types/user.ts";
import z from "zod";

interface UpdateAddressServiceRequest
	extends z.infer<typeof updateAddressBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
	userId: UserID;
}

export class UpdateAddressService {
	private addressRepository: IAddressRepository;

	constructor(addressRepository: IAddressRepository) {
		this.addressRepository = addressRepository;
	}

	async handle({
		id,
		referencePoint: reference_point,
		postalCode: postal_code,
		isDefault: is_default,
		paramsToForget,
		userId,
		...data
	}: UpdateAddressServiceRequest): Promise<void> {
		if (is_default) {
			const setAllAsNotDefaultService =
				makeSetAllAddressesAsNotDefaultService();

			await setAllAsNotDefaultService.handle(userId);
		}

		await this.addressRepository.update({
			id,
			data: {
				is_default,
				address: {
					update: {
						...data,
						reference_point,
						postal_code
					}
				}
			}
		});

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "addresses",
			paramsToForget
		});
	}
}
