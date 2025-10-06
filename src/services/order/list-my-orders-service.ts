import type { FilterField } from "@/types/crud.ts";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import type { OrderPayload } from "@/types/order.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import { transformOrderByStatus } from "@/helpers/order.ts";
import { listCursorQueryParamsSchema } from "@/schemas/generic-schema.ts";
import z from "zod";

type ListMyOrdersServiceRequest = z.infer<typeof listCursorQueryParamsSchema> &
	FilterField;

interface ListMyOrdersServiceResponse {
	orders: OrderPayload[];
	pagination: {
		nextCursor: string | null;
		hasNextPage: boolean;
	};
}

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

		const raw = await cache.rememberForever(
			key,
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
			orders,
			pagination: {
				nextCursor,
				hasNextPage: !!nextCursor
			}
		};
	}
}
