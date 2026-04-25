import {
  type Coupon,
  CouponType,
  type District,
} from "@/generated/prisma/client.js";
import {
  getValueDiscounted,
  transformPriceFromDatabase,
} from "@/helpers/price.js";
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
    let shippingCost = transformPriceFromDatabase(district?.shipping_cost ?? 0);
    let subtotal = orderItemsToProcess.reduce((acc, item) => {
      const addonsTotal = item.addons.reduce((acc, addon) => {
        return acc + addon.price * addon.quantity;
      }, 0);

      return acc + item.product.price * item.product.quantity + addonsTotal;
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
