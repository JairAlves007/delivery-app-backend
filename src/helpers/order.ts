import type { OrderFromRepository, OrderPayload } from "@/types/order.ts";
import { OrderStatusType } from "@prisma/client";

export const getStatusLabel = (status: OrderStatusType) => {
	switch (status) {
		case OrderStatusType.PREPARING:
			return "Preparando...";
		case OrderStatusType.SHIPPED:
			return "Enviado";
		case OrderStatusType.DELIVERED:
			return "Entregue";
		case OrderStatusType.CANCELLED:
			return "Cancelado";
		default:
			return "N/A";
	}
};

export const transformOrderByStatus = (
	order: OrderFromRepository
): OrderPayload => {
	return {
		...order,
		status: {
			label: order.statuses[0].label,
			value: order.statuses[0].value
		}
	};
};
