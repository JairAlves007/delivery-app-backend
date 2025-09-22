import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IAddressRepository } from "@/interfaces/repositories/address-repository.ts";
import type { Address } from "@prisma/client";
import {
	listCursorQueryParamsSchema,
	userIdSchema
} from "@/schemas/generic-schema.ts";
import z from "zod";

type ListAddressServiceRequest = z.infer<typeof listCursorQueryParamsSchema> & {
	userId: z.infer<typeof userIdSchema>;
};

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
		userId,
		limit,
		cursor
	}: ListAddressServiceRequest): Promise<ListAddressServiceResponse> {
		const cache = makeCache();
		const cursorSuffix = cursor ? `_cursor_${cursor}` : "";
		const key = `${cache.keys.addresses}_user_id_${userId}_limit_${limit}${cursorSuffix}`;

		const raw = await cache.rememberForever(
			key,
			async () =>
				await this.addressRepository.cursorPaginate({
					limit,
					cursor,
					filterParams: {
						user_id: userId
					}
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
