import z from "zod";

import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { Address } from "@/generated/prisma/client.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.js";
import { listCursorQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { FilterField } from "@/types/crud.js";

type ListAddressServiceRequest = z.infer<typeof listCursorQueryParamsSchema> &
	FilterField;

interface ListAddressServiceResponse {
	addresses: Address[];
	pagination: {
		nextCursor: string | null;
		hasNextPage: boolean;
	};
}

export class ListAddressService {
	private addressRepository: IAddressRepository;

	constructor(addressRepository: IAddressRepository) {
		this.addressRepository = addressRepository;
	}

	async handle({
		limit,
		cursor,
		filterParams
	}: ListAddressServiceRequest): Promise<ListAddressServiceResponse> {
		const cache = makeCache();
		const cursorSuffix = cursor ? `_cursor_${cursor}` : "";
		const prefixKey = getFilterParamsCacheKey(filterParams);
		const key = `${prefixKey}${cache.keys.addresses}_limit_${limit}${cursorSuffix}`;

		const raw = await cache.rememberForever(
			key,
			async () =>
				await this.addressRepository.cursorPaginate({
					limit,
					cursor,
					filterParams
				})
		);
		const hasNextPage = raw.length > limit;
		const addresses = hasNextPage ? raw.slice(0, limit) : raw;
		const nextCursor = hasNextPage ? addresses[addresses.length - 1].id : null;

		if (addresses.length <= 0) await cache.forget(key);

		return {
			addresses,
			pagination: {
				nextCursor,
				hasNextPage: !!nextCursor
			}
		};
	}
}
