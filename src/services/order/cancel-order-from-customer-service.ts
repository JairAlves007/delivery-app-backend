import { CancelOrderNotAllowed } from "@/errors/order/cancel-not-allowed-error.ts";
import { OrderNotFound } from "@/errors/order/not-found-error.ts";
import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { OrderStatusType } from "@/generated/prisma/client.ts";
import { getStatusLabel, transformOrderByStatus } from "@/helpers/order.ts";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import type { FilterField } from "@/types/crud.ts";

type CancelOrderFromCustomerServiceParams = {
	id: string;
} & FilterField;

export class CancelOrderFromCustomerService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	async handle({ id, filterParams }: CancelOrderFromCustomerServiceParams) {
		const orderFromRepository = await this.orderRepository.findById({
			id,
			filterParams
		});

		if (!orderFromRepository) throw new OrderNotFound();

		const order = transformOrderByStatus(orderFromRepository);

		if (order.status.value !== OrderStatusType.PREPARING)
			throw new CancelOrderNotAllowed();

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

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "orders",
			paramsToForget: filterParams
		});
	}
}
