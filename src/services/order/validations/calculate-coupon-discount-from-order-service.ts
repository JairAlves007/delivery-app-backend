import type { District } from "@/generated/prisma/client.js";
import { calculateOrderPricing } from "@/services/order/pricing/calculate-order-pricing.js";
import type { CouponWithScope } from "@/types/coupon.js";
import type { OrderItemsToProcess } from "@/types/order.js";
import type {
  AppliedPromotion,
  PromotionWithRelations,
} from "@/types/promotion.js";

type CalculateCouponDiscountsRequest = {
  coupon: CouponWithScope | null;
  district: District | null;
  orderItemsToProcess: OrderItemsToProcess[];
  promotions?: PromotionWithRelations[];
  combosSubtotalCents?: number;
};

type CalculateCouponDiscountsResponse = {
  subtotal: number;
  shippingCost: number;
  couponDiscount: number;
  promotionDiscount: number;
  appliedPromotions: AppliedPromotion[];
};

export class CalculateCouponDiscountFromOrderService {
  handle({
    coupon,
    district,
    orderItemsToProcess,
    promotions = [],
    combosSubtotalCents = 0,
  }: CalculateCouponDiscountsRequest): CalculateCouponDiscountsResponse {
    const breakdown = calculateOrderPricing({
      coupon,
      district,
      orderItemsToProcess,
      promotions,
      combosSubtotalCents,
    });

    return {
      subtotal: breakdown.subtotalNetCents,
      shippingCost: breakdown.shippingCostNetCents,
      couponDiscount: breakdown.couponDiscountCents,
      promotionDiscount: breakdown.promotionDiscountCents,
      appliedPromotions: breakdown.appliedPromotions,
    };
  }
}
