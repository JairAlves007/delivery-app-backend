import {
  CouponScopeType,
  CouponType,
  type District,
} from "@/generated/prisma/client.js";
import { getValueDiscounted } from "@/helpers/price.js";
import { applyPromotions } from "@/services/order/pricing/apply-promotions.js";
import { calculateItemPrice } from "@/services/order/pricing/calculate-item-price.js";
import type { CouponWithScope } from "@/types/coupon.js";
import type { OrderItemsToProcess } from "@/types/order.js";
import type {
  AppliedPromotion,
  PromotionPricingItem,
  PromotionWithRelations,
} from "@/types/promotion.js";

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
  promotionOrderDiscountCents: number;
  promotionShippingDiscountCents: number;
  promotionDiscountCents: number;
  appliedPromotions: AppliedPromotion[];
  subtotalNetCents: number;
  shippingCostNetCents: number;
  totalToPayCents: number;
};

export type CalculateOrderPricingParams = {
  orderItemsToProcess: OrderItemsToProcess[];
  coupon: CouponWithScope | null;
  district: District | null;
  promotions?: PromotionWithRelations[];
  combosSubtotalCents?: number;
  now?: Date;
};

const getCouponEligibleSubtotalCents = (
  coupon: CouponWithScope,
  orderItemsToProcess: OrderItemsToProcess[],
  itemTotals: number[],
  subtotalGrossCents: number,
): number => {
  if (coupon.scope === CouponScopeType.PRODUCTS) {
    const productIds = new Set(
      coupon.couponProducts.map((item) => item.product_id),
    );

    return orderItemsToProcess.reduce(
      (acc, item, index) =>
        productIds.has(item.product.id) ? acc + itemTotals[index] : acc,
      0,
    );
  }

  if (coupon.scope === CouponScopeType.CATEGORIES) {
    const categoryIds = new Set(
      coupon.couponCategories.map((item) => item.category_id),
    );

    return orderItemsToProcess.reduce(
      (acc, item, index) =>
        categoryIds.has(item.product.category_id)
          ? acc + itemTotals[index]
          : acc,
      0,
    );
  }

  return subtotalGrossCents;
};

export const calculateOrderPricing = ({
  orderItemsToProcess,
  coupon,
  district,
  promotions = [],
  combosSubtotalCents = 0,
  now = new Date(),
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

  const itemTotals = items.map((it) => it.itemTotalCents);
  const itemsSubtotalCents = itemTotals.reduce((acc, total) => acc + total, 0);
  const subtotalGrossCents = itemsSubtotalCents + combosSubtotalCents;
  const shippingCostGrossCents = district?.shipping_cost ?? 0;

  const promotionItems: PromotionPricingItem[] = orderItemsToProcess.map(
    (item, index) => ({
      productId: item.product.id,
      categoryId: item.product.category_id,
      quantity: Math.max(item.product.quantity, 1),
      itemTotalCents: itemTotals[index],
    }),
  );

  const promotionResult = applyPromotions({
    promotions,
    items: promotionItems,
    subtotalGrossCents,
    shippingCostGrossCents,
    now,
  });

  const promotionOrderDiscountCents = promotionResult.orderDiscountCents;
  const promotionShippingDiscountCents = promotionResult.shippingDiscountCents;

  let orderDiscountCents = 0;
  let shippingDiscountCents = 0;

  const couponApplies =
    coupon &&
    district &&
    coupon.is_active &&
    (coupon.min_order_value == null ||
      subtotalGrossCents >= coupon.min_order_value);

  if (couponApplies) {
    if (coupon.type === CouponType.ORDER) {
      const blockedByPromotion =
        promotionOrderDiscountCents > 0 &&
        !promotionResult.orderStackableWithCoupon;

      if (!blockedByPromotion) {
        const eligibleSubtotalCents = getCouponEligibleSubtotalCents(
          coupon,
          orderItemsToProcess,
          itemTotals,
          subtotalGrossCents,
        );
        const remainingOrderCents =
          subtotalGrossCents - promotionOrderDiscountCents;
        const discount = getValueDiscounted(
          coupon.discount_type,
          coupon.value,
          eligibleSubtotalCents,
        );

        orderDiscountCents = Math.max(
          0,
          Math.min(discount, eligibleSubtotalCents, remainingOrderCents),
        );
      }
    } else {
      const blockedByPromotion =
        promotionShippingDiscountCents > 0 &&
        !promotionResult.shippingStackableWithCoupon;

      if (!blockedByPromotion) {
        const remainingShippingCents =
          shippingCostGrossCents - promotionShippingDiscountCents;
        const discount = getValueDiscounted(
          coupon.discount_type,
          coupon.value,
          shippingCostGrossCents,
        );

        shippingDiscountCents = Math.max(
          0,
          Math.min(discount, remainingShippingCents),
        );
      }
    }
  }

  const subtotalNetCents =
    subtotalGrossCents - promotionOrderDiscountCents - orderDiscountCents;
  const shippingCostNetCents =
    shippingCostGrossCents -
    promotionShippingDiscountCents -
    shippingDiscountCents;
  const totalToPayCents = subtotalNetCents + shippingCostNetCents;
  const couponDiscountCents = orderDiscountCents + shippingDiscountCents;
  const promotionDiscountCents =
    promotionOrderDiscountCents + promotionShippingDiscountCents;

  return {
    items,
    subtotalGrossCents,
    shippingCostGrossCents,
    orderDiscountCents,
    shippingDiscountCents,
    couponDiscountCents,
    promotionOrderDiscountCents,
    promotionShippingDiscountCents,
    promotionDiscountCents,
    appliedPromotions: promotionResult.applied,
    subtotalNetCents,
    shippingCostNetCents,
    totalToPayCents,
  };
};
