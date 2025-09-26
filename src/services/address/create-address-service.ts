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
		const countKey = `${cache.keys.addresses}_user_id_${userId}`;

		console.log({ is_default });

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

		await cache.forgetKeysContaining(cache.keys.addresses);
	}
}
