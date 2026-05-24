import z from "zod";

import { makeFindEstablishmentByIdService } from "@/factories/services/establishment/make-find-establishment-by-id-service.js";
import {
	OrderMessageTrigger,
	OrderStatusType
} from "@/generated/prisma/client.js";
import { getStatusLabel } from "@/helpers/order.js";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { enqueueWhatsAppMessage } from "@/queues/whatsapp-queue.js";
import { updateOrderStatusBodySchema } from "@/schemas/order-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

interface UpdateOrderRequest
	extends
		z.infer<typeof updateOrderStatusBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
	establishmentId: EstablishmentID;
}

const mapStatusToTrigger = (
	status: OrderStatusType
): OrderMessageTrigger | null => {
	switch (status) {
		case OrderStatusType.SHIPPED:
			return OrderMessageTrigger.STATUS_SHIPPED;
		case OrderStatusType.DELIVERED:
			return OrderMessageTrigger.STATUS_DELIVERED;
		case OrderStatusType.CANCELLED:
			return OrderMessageTrigger.STATUS_CANCELLED;
		case OrderStatusType.PREPARING:
			return null;
		default:
			return null;
	}
};

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

		const trigger = mapStatusToTrigger(status);
		if (!trigger) return;

		const order = await this.orderRepository.findById({
			id,
			filterParams: { establishment_id: establishmentId }
		});
		if (!order) return;

		const findEstablishmentByIdService = makeFindEstablishmentByIdService();
		const establishment = await findEstablishmentByIdService.handle({
			id: establishmentId
		});

		await enqueueWhatsAppMessage({
			establishmentId,
			orderId: order.id,
			trigger,
			toPhone: order.customer_phone,
			context: {
				customer_name: order.customer_name,
				customer_phone: order.customer_phone,
				order_id: order.id,
				status_label: getStatusLabel(status),
				establishment_name: establishment?.name ?? "",
				estimated_time: ""
			}
		});
	}
}
