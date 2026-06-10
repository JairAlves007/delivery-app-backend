import z from "zod";

import { OrderStatusType } from "@/generated/prisma/client.js";
import { formatDateToHumanReadable } from "@/helpers/date.js";
import { getStatusLabel } from "@/helpers/order.js";
import {
	transformPriceFromDatabase,
	transformPriceToHumanReadable
} from "@/helpers/price.js";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { sendWhatsappMessageQueue } from "@/queues/whatsapp-queue.js";
import { updateOrderStatusBodySchema } from "@/schemas/order-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

const NOTIFIABLE_STATUSES: OrderStatusType[] = [
	OrderStatusType.SHIPPED,
	OrderStatusType.DELIVERED,
	OrderStatusType.CANCELLED
];

interface UpdateOrderRequest
	extends
		z.infer<typeof updateOrderStatusBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
	establishmentId: EstablishmentID;
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

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "dashboard",
			paramsToForget
		});

		await this.notifyCustomer({ id, status, establishmentId });
	}

	private async notifyCustomer({
		id,
		status,
		establishmentId
	}: Pick<UpdateOrderRequest, "id" | "status" | "establishmentId">) {
		if (!NOTIFIABLE_STATUSES.includes(status)) return;

		const order = await this.orderRepository.findById({
			id,
			filterParams: { establishment_id: establishmentId }
		});

		if (!order) return;

		const orderTotal = transformPriceToHumanReadable(
			transformPriceFromDatabase(order.subtotal + order.shipping_fee)
		);

		await sendWhatsappMessageQueue({
			establishmentId,
			orderId: id,
			orderStatus: status,
			recipientPhone: order.customer_phone,
			context: {
				customerName: order.customer_name,
				orderId: id,
				orderTotal,
				orderCreatedAt: formatDateToHumanReadable(order.created_at)
			}
		});
	}
}
