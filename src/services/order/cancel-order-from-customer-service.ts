import { CancelOrderNotAllowed } from "@/errors/order/cancel-not-allowed-error.ts";
import { OrderNotFound } from "@/errors/order/not-found-error.ts";
import { OrderStatusType } from "@/generated/prisma/client.ts";
import { getStatusLabel, transformOrderByStatus } from "@/helpers/order.ts";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.ts";
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

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "orders",
			paramsToForget: filterParams
		});
	}
}
