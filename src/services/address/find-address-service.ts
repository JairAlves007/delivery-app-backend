import z from "zod";

import { AddressNotFound } from "@/errors/address/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.js";
import { addressParamsSchema } from "@/schemas/address-schema.js";
import type { UserAddressWithDefault } from "@/types/address.js";
import type { FilterField } from "@/types/crud.js";

type FindAddressServiceRequest = z.infer<typeof addressParamsSchema> &
	FilterField;

export class FindAddressService {
	private addressRepository: IAddressRepository;

	constructor(addressRepository: IAddressRepository) {
		this.addressRepository = addressRepository;
	}

	async handle({
		id,
		filterParams
	}: FindAddressServiceRequest): Promise<UserAddressWithDefault> {
		const cache = makeCache();
		const filterPrefixKey = getFilterParamsCacheKey(filterParams);
		const key = `${filterPrefixKey}${cache.keys.addresses}_${id}`;

		const address = await cache.rememberForever(
			key,
			async () => await this.addressRepository.findById({ id, filterParams })
		);

		if (!address) throw new AddressNotFound();

		return address;
	}
}
