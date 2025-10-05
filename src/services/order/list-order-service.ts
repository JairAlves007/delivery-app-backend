import { InvalidPage } from "@/errors/pagination/invalid-page.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import { listQueryParamsSchema } from "@/schemas/generic-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import { OrderFromRepository } from "@/types/order.ts";
import z from "zod";

type ListOrderServiceRequest = z.infer<typeof listQueryParamsSchema> &
	FilterField;

interface ListOrderServiceResponse
	extends Pick<ListOrderServiceRequest, "page"> {
	orders: OrderFromRepository[];
	total: number;
	perPage?: number;
	totalPages?: number;
}

export class ListOrderService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
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
				orders,
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
			orders,
			total
		};
	}
}
