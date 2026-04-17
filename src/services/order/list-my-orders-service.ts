import z from "zod";

import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { transformOrderByStatus } from "@/helpers/order.js";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.js";
import { listCursorQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { CursorPaginatedResponse, FilterField } from "@/types/crud.js";
import type { OrderPayload } from "@/types/order.js";

type ListMyOrdersServiceRequest = z.infer<typeof listCursorQueryParamsSchema> &
	FilterField;

type ListMyOrdersServiceResponse = CursorPaginatedResponse<OrderPayload>;

export class ListMyOrdersService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	async handle({
		limit,
		cursor,
		filterParams
	}: ListMyOrdersServiceRequest): Promise<ListMyOrdersServiceResponse> {
		const cache = makeCache();
		const cursorSuffix = cursor ? `_cursor_${cursor}` : "";
		const prefixKey = getFilterParamsCacheKey(filterParams);
		const key = `${prefixKey}${cache.keys.orders}_limit_${limit}${cursorSuffix}`;

		const raw = await cache.remember(
			key,
			Constants.CACHE_TTL.orders,
			async () =>
				await this.orderRepository.cursorPaginate({
					limit,
					cursor,
					filterParams
				})
		);
		const hasNextPage = raw.length > limit;
		const myOrders = hasNextPage ? raw.slice(0, limit) : raw;
		const nextCursor = hasNextPage ? myOrders[myOrders.length - 1].id : null;

		if (myOrders.length <= 0) await cache.forget(key);

		const orders = myOrders.map(order => {
			return transformOrderByStatus(order);
		});

		return {
			items: orders,
			pagination: {
				nextCursor,
				hasNextPage: !!nextCursor
			}
		};
	}
}
