import { AddressNotFound } from "@/errors/address/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import { addressParamsSchema } from "@/schemas/address-schema.ts";
import type { UserAddressWithDefault } from "@/types/address.ts";
import type { FilterField } from "@/types/crud.ts";
import z from "zod";

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
