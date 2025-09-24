import { makeSetAllAddressesAsNotDefaultService } from "@/factories/services/address/user/make-set-all-addresses-as-not-default-service.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import { updateAddressBodySchema } from "@/schemas/address-schema.ts";
import type { UserID } from "@/types/user.ts";
import z from "zod";

type UpdateAddressServiceRequest = z.infer<typeof updateAddressBodySchema> & {
	userId: UserID;
};

export class UpdateAddressService {
	private addressRepository: IAddressRepository;

	constructor(addressRepository: IAddressRepository) {
		this.addressRepository = addressRepository;
	}

	async handle(
		id: string,
		{
			referencePoint: reference_point,
			postalCode: postal_code,
			isDefault: is_default,
			userId,
			...data
		}: UpdateAddressServiceRequest
	): Promise<void> {
		const cache = makeCache();

		if (is_default) {
			const setAllAsNotDefaultService =
				makeSetAllAddressesAsNotDefaultService();

			await setAllAsNotDefaultService.handle(userId);
		}

		await this.addressRepository.update({
			id,
			data: {
				...data,
				reference_point,
				postal_code,
				userAddresses: {
					update: {
						where: {
							user_id_address_id: {
								address_id: id,
								user_id: userId
							}
						},
						data: {
							is_default,
							user: {
								connect: {
									id: userId
								}
							}
						}
					}
				}
			}
		});

		await cache.forgetKeysContaining(cache.keys.addresses);
	}
}
