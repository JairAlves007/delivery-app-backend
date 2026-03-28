import z from "zod";

import { OrderNotFound } from "@/errors/order/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { transformOrderByStatus } from "@/helpers/order.js";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.js";
import { orderParamsSchema } from "@/schemas/order-schema.js";
import type { FilterField } from "@/types/crud.js";

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
