import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import {
	addressLocationSchema,
	userIdSchema
} from "@/schemas/generic-schema.ts";
import z from "zod";

type CreateAddressServiceRequest = z.infer<typeof addressLocationSchema> & {
	userId: z.infer<typeof userIdSchema>;
};

export class CreateAddressService {
	private addressRepository: IAddressRepository;

	constructor(addressRepository: IAddressRepository) {
		this.addressRepository = addressRepository;
	}

	async handle({
		referencePoint: reference_point,
		postalCode: postal_code,
		userId,
		...data
	}: CreateAddressServiceRequest): Promise<void> {
		const cache = makeCache();

		await this.addressRepository.create({
			...data,
			reference_point,
			postal_code,
			userAddresses: {
				create: {
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
