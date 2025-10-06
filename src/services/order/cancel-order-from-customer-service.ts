import type { FilterField } from "@/types/crud.ts";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import { OrderStatusType } from "@prisma/client";
import { getStatusLabel, transformOrderByStatus } from "@/helpers/order.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { OrderNotFound } from "@/errors/order/not-found-error.ts";
import { CancelOrderNotAllowed } from "@/errors/order/cancel-not-allowed-error.ts";

export class CancelOrderFromCustomerService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	async handle(id: string, { filterParams }: FilterField) {
		const orderFromRepository = await this.orderRepository.findById({
			id,
			filterParams
		});

		if (!orderFromRepository) throw new OrderNotFound();

		const order = transformOrderByStatus(orderFromRepository);

		if (order.status.value !== OrderStatusType.PREPARING)
			throw new CancelOrderNotAllowed();

		const cache = makeCache();
		const cancelStatus: OrderStatusType = OrderStatusType.CANCELLED;

		await this.orderRepository.update({
			id,
			filterParams,
			data: {
				statuses: {
					create: {
						label: getStatusLabel(cancelStatus),
						value: cancelStatus
					}
				}
			}
		});

		await cache.forgetKeysContaining(cache.keys.orders);
	}
}
