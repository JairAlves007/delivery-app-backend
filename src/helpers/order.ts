import {
  AddonPricingStrategy,
  CouponType,
  DeliveryType,
  DiscountType,
  OrderStatusType,
  PaymentMethodType,
} from "@/generated/prisma/client.js";
import type { OrderFromRepository, OrderPayload } from "@/types/order.js";

import {
  transformPriceFromDatabase,
  transformPriceToHumanReadable,
} from "./price.js";

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
    change_amount:
      order.change_amount != null
        ? transformPriceFromDatabase(order.change_amount)
        : null,
    shipping_fee: transformPriceFromDatabase(order.shipping_fee),
    subtotal: transformPriceFromDatabase(order.subtotal),
    items: order.items.map((item) => ({
      ...item,
      product_price: transformPriceFromDatabase(item.product_price),
      addons_subtotal: transformPriceFromDatabase(item.addons_subtotal),
      addons: item.addons.map((addon) => ({
        ...addon,
        addon_price: transformPriceFromDatabase(addon.addon_price),
      })),
    })),
    coupon: order.coupon
      ? {
          ...order.coupon,
          value:
            order.coupon.discount_type === DiscountType.FIXED
              ? transformPriceFromDatabase(order.coupon.value)
              : order.coupon.value,
        }
      : null,
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

export const getAddonStrategyLabel = (
  strategy: AddonPricingStrategy,
): string => {
  switch (strategy) {
    case AddonPricingStrategy.MAX:
      return "(maior preço)";
    case AddonPricingStrategy.AVERAGE:
      return "(média)";
    case AddonPricingStrategy.NONE:
      return "(sem custo)";
    case AddonPricingStrategy.SUM:
      return "";
  }
};

export const getFractionLabel = (
  partsOccupied: number,
  partsCount: number | null,
): string => {
  if (partsCount == null || partsCount <= 0) return `${partsOccupied}x`;
  return `${partsOccupied}/${partsCount}`;
};

export const formatWeight = (grams: number): string => {
  if (grams >= 1000)
    return `${(grams / 1000).toFixed(3).replace(".", ",")} kg`;
  return `${grams} g`;
};
