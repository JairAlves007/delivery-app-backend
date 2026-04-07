import z from "zod";

import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { Address } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.js";
import { listCursorQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { CursorPaginatedResponse, FilterField } from "@/types/crud.js";

type ListAddressServiceRequest = z.infer<typeof listCursorQueryParamsSchema> &
	FilterField;

type ListAddressServiceResponse = CursorPaginatedResponse<Address>;

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

		const raw = await cache.remember(
			key,
			Constants.CACHE_TTL.addresses,
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
			items: addresses,
			pagination: {
				nextCursor,
				hasNextPage: !!nextCursor
			}
		};
	}
}
