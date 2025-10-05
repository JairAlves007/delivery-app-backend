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
