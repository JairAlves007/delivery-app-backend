import type { Coupon, District } from "@/generated/prisma/client.js";
import { calculateOrderPricing } from "@/services/order/pricing/calculate-order-pricing.js";
import type { OrderItemsToProcess } from "@/types/order.js";

type CalculateCouponDiscountsRequest = {
  coupon: Coupon | null;
  district: District | null;
  orderItemsToProcess: OrderItemsToProcess[];
};

type CalculateCouponDiscountsResponse = {
  subtotal: number;
  shippingCost: number;
  couponDiscount: number;
};

export class CalculateCouponDiscountFromOrderService {
  handle({
    coupon,
    district,
    orderItemsToProcess,
  }: CalculateCouponDiscountsRequest): CalculateCouponDiscountsResponse {
    const breakdown = calculateOrderPricing({
      coupon,
      district,
      orderItemsToProcess,
    });

    return {
      subtotal: breakdown.subtotalNetCents,
      shippingCost: breakdown.shippingCostNetCents,
      couponDiscount: breakdown.couponDiscountCents,
    };
  }
}
