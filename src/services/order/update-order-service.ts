import z from "zod";

import { getStatusLabel } from "@/helpers/order.js";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateOrderStatusBodySchema } from "@/schemas/order-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

interface UpdateOrderRequest
	extends
		z.infer<typeof updateOrderStatusBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
}

export class UpdateOrderService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	async handle({
		id,
		status,
		establishmentId,
		paramsToForget
	}: UpdateOrderRequest) {
		await this.orderRepository.update({
			id,
			filterParams: { establishment_id: establishmentId },
			data: {
				statuses: {
					create: {
						label: getStatusLabel(status),
						value: status
					}
				}
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "orders",
			paramsToForget
		});
	}
}
