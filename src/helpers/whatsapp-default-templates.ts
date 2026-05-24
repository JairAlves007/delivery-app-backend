import { OrderMessageTrigger } from "@/generated/prisma/client.js";

export const WHATSAPP_DEFAULT_TEMPLATES: Record<OrderMessageTrigger, string> = {
	[OrderMessageTrigger.ORDER_CONFIRMED]:
		"Olá {customer_name}! Seu pedido foi confirmado em {establishment_name}. Pedido: {order_id}. Total: {order_total}. Acompanharemos o status por aqui!",
	[OrderMessageTrigger.STATUS_SHIPPED]:
		"{customer_name}, seu pedido {order_id} saiu para entrega! 🛵",
	[OrderMessageTrigger.STATUS_DELIVERED]:
		"{customer_name}, seu pedido foi entregue! ✅ Bom apetite!",
	[OrderMessageTrigger.STATUS_CANCELLED]:
		"{customer_name}, seu pedido {order_id} foi cancelado. Em caso de dúvidas, entre em contato conosco."
};
