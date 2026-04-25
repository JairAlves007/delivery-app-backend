import {
  CouponType,
  DeliveryType,
  DiscountType,
  OrderStatusType,
  PaymentMethodType,
} from "@/generated/prisma/client.js";
import type { OrderFromRepository, OrderPayload } from "@/types/order.js";

import { transformPriceToHumanReadable } from "./price.js";

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
  order: OrderFromRepository,
): OrderPayload => {
  return {
    ...order,
    status: {
      label: order.statuses[0].label,
      value: order.statuses[0].value,
    },
  };
};

export const getCouponAppliedLabel = (
  couponType: CouponType,
  discountType: DiscountType,
  couponValue: number,
): string => {
  const labels = {
    [DiscountType.PERCENTAGE]: `Desconto de ${couponValue}%`,
    [DiscountType.FIXED]: `Desconto de ${transformPriceToHumanReadable(
      couponValue,
    )}`,
  };

  switch (couponType) {
    case CouponType.ORDER:
      return `${labels[discountType]} no pedido`;
    case CouponType.SHIPPING:
      return `${labels[discountType]} na entrega`;
  }
};

export const getDeliveryTypeLabel = (deliveryType: DeliveryType): string => {
  switch (deliveryType) {
    case DeliveryType.DELIVERY:
      return "Entrega a domicílio";
    case DeliveryType.PICKUP:
      return "Retirada no local";
  }
};

export const getPaymentMethodLabel = (
  paymentMethod: PaymentMethodType,
): string => {
  switch (paymentMethod) {
    case PaymentMethodType.CARD:
      return "Cartão";
    case PaymentMethodType.PIX:
      return "PIX";
    case PaymentMethodType.MONEY:
      return "Dinheiro";
  }
};
