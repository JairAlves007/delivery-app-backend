import { makeSetAllAddressesAsNotDefaultService } from "@/factories/services/address/user/make-set-all-addresses-as-not-default-service.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import { createAddressBodySchema } from "@/schemas/address-schema.ts";
import type { UserID } from "@/types/user.ts";
import z from "zod";

type CreateAddressServiceRequest = z.infer<typeof createAddressBodySchema> & {
	userId: UserID;
};

export class CreateAddressService {
	private addressRepository: IAddressRepository;

	constructor(addressRepository: IAddressRepository) {
		this.addressRepository = addressRepository;
	}

	async handle({
		referencePoint: reference_point,
		postalCode: postal_code,
		isDefault: is_default,
		userId,
		...data
	}: CreateAddressServiceRequest): Promise<void> {
		const cache = makeCache();

		if (is_default) {
			const setAllAsNotDefaultService =
				makeSetAllAddressesAsNotDefaultService();

			await setAllAsNotDefaultService.handle(userId);
		}

		await this.addressRepository.create({
			...data,
			reference_point,
			postal_code,
			userAddresses: {
				create: {
					is_default,
					user: {
						connect: {
							id: userId
						}
					}
				}
			}
		});

		await cache.forgetKeysContaining(cache.keys.addresses);
	}
}
