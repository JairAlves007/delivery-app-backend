import {
  type Coupon,
  CouponType,
  type District,
  ProductPricingMode,
} from "@/generated/prisma/client.js";
import { getValueDiscounted } from "@/helpers/price.js";
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
    let shippingCost = district?.shipping_cost ?? 0;

    let subtotal = orderItemsToProcess.reduce((acc, item) => {
      const baseItemTotal =
        item.product.pricing_mode === ProductPricingMode.PER_WEIGHT &&
        item.product.price_per_100g != null &&
        item.product.weight_grams != null
          ? Math.round(
              (item.product.price_per_100g * item.product.weight_grams) / 100,
            )
          : item.product.price * item.product.quantity;

      return acc + baseItemTotal + item.addonsSubtotalCents;
    }, 0);

    let couponDiscount = 0;

    if (!!coupon && !!district) {
      const valueByType = {
        [CouponType.ORDER]: subtotal,
        [CouponType.SHIPPING]: shippingCost,
      };

      couponDiscount = getValueDiscounted(
        coupon.discount_type,
        coupon.value,
        valueByType[coupon.type],
      );

      switch (coupon.type) {
        case CouponType.ORDER:
          subtotal -= couponDiscount;
          break;
        case CouponType.SHIPPING:
          shippingCost -= couponDiscount;
          break;
      }
    }

    return {
      subtotal,
      shippingCost,
      couponDiscount,
    };
  }
}
