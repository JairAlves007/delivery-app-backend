import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { getStatusLabel } from "@/helpers/order.ts";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import { updateOrderStatusBodySchema } from "@/schemas/order-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

interface UpdateOrderRequest
	extends z.infer<typeof updateOrderStatusBodySchema>,
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

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "orders",
			paramsToForget
		});
	}
}
