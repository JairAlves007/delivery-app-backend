import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import { updateAddressBodySchema } from "@/schemas/address-schema.ts";
import { userIdSchema } from "@/schemas/generic-schema.ts";
import z from "zod";

type UpdateAddressServiceRequest = z.infer<typeof updateAddressBodySchema> & {
	userId: z.infer<typeof userIdSchema>;
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
			userId,
			...data
		}: UpdateAddressServiceRequest
	): Promise<void> {
		const cache = makeCache();

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
