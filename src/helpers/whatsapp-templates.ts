import { OrderStatusType } from "@/generated/prisma/client.js";
import type { WhatsappTemplateVariables } from "@/types/whatsapp.js";

export const DEFAULT_STATUS_TEMPLATES: Record<OrderStatusType, string> = {
  [OrderStatusType.PREPARING]:
    "Olá {customer_name}! 🧑‍🍳 Recebemos seu pedido em {establishment_name} e já começamos a preparar. Total: {order_total}.",
  [OrderStatusType.SHIPPED]:
    "Olá {customer_name}! 🛵 Seu pedido em {establishment_name} saiu para entrega.",
  [OrderStatusType.DELIVERED]:
    "Olá {customer_name}! ✅ Seu pedido em {establishment_name} foi entregue. Bom apetite!",
  [OrderStatusType.CANCELLED]:
    "Olá {customer_name}. ❌ Seu pedido em {establishment_name} foi cancelado. Em caso de dúvidas, fale conosco.",
};

export const DEFAULT_SCHEDULED_STATUS_TEMPLATES: Record<OrderStatusType, string> =
  {
    [OrderStatusType.PREPARING]:
      "Olá {customer_name}! 🧑‍🍳 Recebemos seu pedido agendado em {establishment_name} para {scheduled_at}. Total: {order_total}.",
    [OrderStatusType.SHIPPED]:
      "Olá {customer_name}! 🛵 Seu pedido agendado em {establishment_name} para {scheduled_at} saiu para entrega.",
    [OrderStatusType.DELIVERED]:
      "Olá {customer_name}! ✅ Seu pedido agendado em {establishment_name} foi entregue. Bom apetite!",
    [OrderStatusType.CANCELLED]:
      "Olá {customer_name}. ❌ Seu pedido agendado em {establishment_name} para {scheduled_at} foi cancelado. Em caso de dúvidas, fale conosco.",
  };

export const TEMPLATE_PLACEHOLDERS = [
  "{customer_name}",
  "{order_id}",
  "{status_label}",
  "{establishment_name}",
  "{order_total}",
  "{order_created_at}",
  "{scheduled_at}",
] as const;

export const renderTemplate = (
  body: string,
  variables: WhatsappTemplateVariables,
): string => {
  return body
    .replaceAll("{customer_name}", variables.customerName)
    .replaceAll("{order_id}", variables.orderId)
    .replaceAll("{status_label}", variables.statusLabel)
    .replaceAll("{establishment_name}", variables.establishmentName)
    .replaceAll("{order_total}", variables.orderTotal)
    .replaceAll("{order_created_at}", variables.orderCreatedAt)
    .replaceAll("{scheduled_at}", variables.scheduledAt);
};
