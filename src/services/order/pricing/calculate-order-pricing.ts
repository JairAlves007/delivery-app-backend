import {
  type Coupon,
  CouponType,
  type District,
} from "@/generated/prisma/client.js";
import { getValueDiscounted } from "@/helpers/price.js";
import { calculateItemPrice } from "@/services/order/pricing/calculate-item-price.js";
import type { OrderItemsToProcess } from "@/types/order.js";

export type OrderItemPricing = {
  productBaseCents: number;
  addonsSubtotalCents: number;
  itemTotalCents: number;
};

export type OrderPricingBreakdown = {
  items: OrderItemPricing[];
  subtotalGrossCents: number;
  shippingCostGrossCents: number;
  orderDiscountCents: number;
  shippingDiscountCents: number;
  couponDiscountCents: number;
  subtotalNetCents: number;
  shippingCostNetCents: number;
  totalToPayCents: number;
};

export type CalculateOrderPricingParams = {
  orderItemsToProcess: OrderItemsToProcess[];
  coupon: Coupon | null;
  district: District | null;
};

export const calculateOrderPricing = ({
  orderItemsToProcess,
  coupon,
  district,
}: CalculateOrderPricingParams): OrderPricingBreakdown => {
  const items: OrderItemPricing[] = orderItemsToProcess.map((item) => {
    const productBaseCents = calculateItemPrice({
      pricingMode: item.product.pricing_mode,
      priceCents: item.product.price,
      pricePer100gCents: item.product.price_per_100g ?? null,
      quantity: item.product.quantity,
      weightGrams: item.product.weight_grams ?? null,
    });
    const productQuantity = Math.max(item.product.quantity, 1);
    const addonsSubtotalCents = item.addonsSubtotalCents * productQuantity;
    return {
      productBaseCents,
      addonsSubtotalCents,
      itemTotalCents: productBaseCents + addonsSubtotalCents,
    };
  });

  const subtotalGrossCents = items.reduce(
    (acc, it) => acc + it.itemTotalCents,
    0,
  );

  const shippingCostGrossCents = district?.shipping_cost ?? 0;

  let orderDiscountCents = 0;
  let shippingDiscountCents = 0;

  if (coupon && district) {
    const baseByType = {
      [CouponType.ORDER]: subtotalGrossCents,
      [CouponType.SHIPPING]: shippingCostGrossCents,
    };

    const discount = getValueDiscounted(
      coupon.discount_type,
      coupon.value,
      baseByType[coupon.type],
    );

    if (coupon.type === CouponType.ORDER) {
      orderDiscountCents = Math.min(discount, subtotalGrossCents);
    } else {
      shippingDiscountCents = Math.min(discount, shippingCostGrossCents);
    }
  }

  const subtotalNetCents = subtotalGrossCents - orderDiscountCents;
  const shippingCostNetCents = shippingCostGrossCents - shippingDiscountCents;
  const totalToPayCents = subtotalNetCents + shippingCostNetCents;
  const couponDiscountCents = orderDiscountCents + shippingDiscountCents;

  return {
    items,
    subtotalGrossCents,
    shippingCostGrossCents,
    orderDiscountCents,
    shippingDiscountCents,
    couponDiscountCents,
    subtotalNetCents,
    shippingCostNetCents,
    totalToPayCents,
  };
};
