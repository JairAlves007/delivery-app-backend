import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import type { UserAddressWithDefault } from "@/types/address.ts";
import { addressParamsSchema } from "@/schemas/address-schema.ts";
import z from "zod";
import { AddressNotFound } from "@/errors/address/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";

type FindAddressServiceRequest = z.infer<typeof addressParamsSchema>;

export class FindAddressService {
	private addressRepository: IAddressRepository;

	constructor(addressRepository: IAddressRepository) {
		this.addressRepository = addressRepository;
	}

	async handle({
		id
	}: FindAddressServiceRequest): Promise<UserAddressWithDefault> {
		const cache = makeCache();
		const key = `${cache.keys.addresses}_${id}`;

		const address = await cache.rememberForever(
			key,
			async () => await this.addressRepository.findById({ id })
		);

		if (!address) {
			await cache.forget(key);
			throw new AddressNotFound();
		}

		return address;
	}
}
