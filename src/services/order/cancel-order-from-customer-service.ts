import { CancelOrderNotAllowed } from "@/errors/order/cancel-not-allowed-error.js";
import { OrderNotFound } from "@/errors/order/not-found-error.js";
import { OrderStatusType } from "@/generated/prisma/client.js";
import { getStatusLabel } from "@/helpers/order.js";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { FilterField } from "@/types/crud.js";

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

		const latestStatus = orderFromRepository.statuses[0]?.value;

		if (latestStatus !== OrderStatusType.PREPARING)
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

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "orders",
			paramsToForget: filterParams
		});
	}
}
