import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getStatusLabel } from "@/helpers/order.ts";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import { updateOrderStatusBodySchema } from "@/schemas/order-schema.ts";
import z from "zod";

type UpdateOrderRequest = z.infer<typeof updateOrderStatusBodySchema>;

export class UpdateOrderService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	async handle(id: string, { status, establishmentId }: UpdateOrderRequest) {
		const cache = makeCache();

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

		await cache.forgetKeysContaining(cache.keys.orders);
	}
}
