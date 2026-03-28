import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { transformOrderByStatus } from "@/helpers/order.js";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { FilterField } from "@/types/crud.js";
import type { OrderFromRepository, OrderPayload } from "@/types/order.js";

type ListOrderServiceRequest = z.infer<typeof listQueryParamsSchema> &
	FilterField;

interface ListOrderServiceResponse extends Pick<
	ListOrderServiceRequest,
	"page"
> {
	orders: OrderPayload[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListOrderService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	private mapOrders(orders: OrderFromRepository[]): OrderPayload[] {
		return orders.map(order => {
			return transformOrderByStatus(order);
		});
	}

	async handle({
		page,
		perPage,
		filterParams
	}: ListOrderServiceRequest): Promise<ListOrderServiceResponse> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey(filterParams);

		const isPaging = !!page;
		const totalPromise = cache.rememberForever(
			`${prefixKey}total_${cache.keys.orders}`,
			async () => await this.orderRepository.count(filterParams)
		);

		if (isPaging) {
			const key = `${prefixKey}${cache.keys.orders}_page_${page}_per_page_${perPage}`;
			const [total, orders] = await Promise.all([
				totalPromise,
				cache.rememberForever(
					key,
					async () =>
						await this.orderRepository.paginate({
							page,
							perPage,
							filterParams
						})
				)
			]);

			const totalPages = Math.ceil(total / perPage);

			if (page > totalPages) {
				await cache.forget(key);
				throw new InvalidPage();
			}

			return {
				orders: this.mapOrders(orders),
				total,
				page,
				perPage,
				totalPages
			};
		}

		const [total, orders] = await Promise.all([
			totalPromise,
			cache.rememberForever(
				`${prefixKey}${cache.keys.orders}`,
				async () => await this.orderRepository.listAll(filterParams)
			)
		]);

		return {
			orders: this.mapOrders(orders),
			total
		};
	}
}
