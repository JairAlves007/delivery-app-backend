import { OrderNotFound } from "@/errors/order/not-found-error.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import { transformOrderByStatus } from "@/helpers/order.ts";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import { orderParamsSchema } from "@/schemas/order-schema.ts";
import type { FilterField } from "@/types/crud.ts";
import z from "zod";

type FindOrderServiceRequest = z.infer<typeof orderParamsSchema> & FilterField;

export class FindOrderService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	async handle({ id, filterParams }: FindOrderServiceRequest) {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey(filterParams);

		const key = `${prefixKey}${cache.keys.orders}_${id}`;
		const order = await cache.rememberForever(
			key,
			async () => await this.orderRepository.findById({ id, filterParams })
		);

		if (!order) throw new OrderNotFound();

		return transformOrderByStatus(order);
	}
}
