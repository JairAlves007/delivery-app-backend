import {
  CouponScopeType,
  PromotionType,
} from "@/generated/prisma/client.js";
import {
  getZonedWeekdayAndMinutes,
  parseHourToMinutes,
  WEEK_DAYS,
} from "@/helpers/establishment.js";
import { getValueDiscounted } from "@/helpers/price.js";
import type {
  AppliedPromotion,
  ApplyPromotionsResult,
  PromotionPricingItem,
  PromotionWithRelations,
} from "@/types/promotion.js";

type ApplyPromotionsParams = {
  promotions: PromotionWithRelations[];
  items: PromotionPricingItem[];
  subtotalGrossCents: number;
  shippingCostGrossCents: number;
  now: Date;
};

type PromotionEffect = {
  promotion: PromotionWithRelations;
  discountCents: number;
  base: "ORDER" | "SHIPPING";
};

const isWithinDateWindow = (
  promotion: PromotionWithRelations,
  now: Date,
): boolean => {
  if (promotion.starts_at && promotion.starts_at > now) return false;
  if (promotion.ends_at && promotion.ends_at < now) return false;
  return true;
};

const isWithinHappyHour = (
  promotion: PromotionWithRelations,
  now: Date,
): boolean => {
  const { weekdayIndex, minutesOfDay } = getZonedWeekdayAndMinutes(now);
  const today = WEEK_DAYS[weekdayIndex];

  return promotion.windows.some((window) => {
    if (window.day_of_week !== today) return false;
    const opens = parseHourToMinutes(window.opens_at);
    const closes = parseHourToMinutes(window.closes_at);
    return minutesOfDay >= opens && minutesOfDay < closes;
  });
};

const getScopedSubtotalCents = (
  promotion: PromotionWithRelations,
  items: PromotionPricingItem[],
  subtotalGrossCents: number,
): number => {
  if (promotion.scope === CouponScopeType.PRODUCTS) {
    const productIds = new Set(
      promotion.promotionProducts.map((item) => item.product_id),
    );
    return items.reduce(
      (acc, item) =>
        productIds.has(item.productId) ? acc + item.itemTotalCents : acc,
      0,
    );
  }

  if (promotion.scope === CouponScopeType.CATEGORIES) {
    const categoryIds = new Set(
      promotion.promotionCategories.map((item) => item.category_id),
    );
    return items.reduce(
      (acc, item) =>
        categoryIds.has(item.categoryId) ? acc + item.itemTotalCents : acc,
      0,
    );
  }

  return subtotalGrossCents;
};

const isItemInScope = (
  promotion: PromotionWithRelations,
  item: PromotionPricingItem,
): boolean => {
  if (promotion.scope === CouponScopeType.PRODUCTS) {
    return promotion.promotionProducts.some(
      (entry) => entry.product_id === item.productId,
    );
  }
  if (promotion.scope === CouponScopeType.CATEGORIES) {
    return promotion.promotionCategories.some(
      (entry) => entry.category_id === item.categoryId,
    );
  }
  return true;
};

const getBuyXPayYDiscountCents = (
  promotion: PromotionWithRelations,
  items: PromotionPricingItem[],
): number => {
  const buy = promotion.buy_quantity ?? 0;
  const pay = promotion.pay_quantity ?? 0;

  if (buy <= 0 || pay < 0 || buy <= pay) return 0;

  return items.reduce((acc, item) => {
    if (!isItemInScope(promotion, item) || item.quantity <= 0) return acc;

    const freeUnits = Math.floor(item.quantity / buy) * (buy - pay);
    if (freeUnits <= 0) return acc;

    const unitPriceCents = item.itemTotalCents / item.quantity;
    return acc + Math.round(freeUnits * unitPriceCents);
  }, 0);
};

const getPromotionEffect = (
  promotion: PromotionWithRelations,
  items: PromotionPricingItem[],
  subtotalGrossCents: number,
  shippingCostGrossCents: number,
  now: Date,
): PromotionEffect | null => {
  switch (promotion.type) {
    case PromotionType.MIN_ORDER_DISCOUNT: {
      if (
        promotion.min_order_value != null &&
        subtotalGrossCents < promotion.min_order_value
      )
        return null;
      if (promotion.discount_type == null || promotion.value == null)
        return null;

      const scoped = getScopedSubtotalCents(
        promotion,
        items,
        subtotalGrossCents,
      );
      const discount = Math.min(
        getValueDiscounted(promotion.discount_type, promotion.value, scoped),
        scoped,
      );
      return discount > 0
        ? { promotion, discountCents: discount, base: "ORDER" }
        : null;
    }

    case PromotionType.HAPPY_HOUR: {
      if (!isWithinHappyHour(promotion, now)) return null;
      if (promotion.discount_type == null || promotion.value == null)
        return null;

      const scoped = getScopedSubtotalCents(
        promotion,
        items,
        subtotalGrossCents,
      );
      const discount = Math.min(
        getValueDiscounted(promotion.discount_type, promotion.value, scoped),
        scoped,
      );
      return discount > 0
        ? { promotion, discountCents: discount, base: "ORDER" }
        : null;
    }

    case PromotionType.BUY_X_PAY_Y: {
      const discount = getBuyXPayYDiscountCents(promotion, items);
      return discount > 0
        ? { promotion, discountCents: discount, base: "ORDER" }
        : null;
    }

    case PromotionType.FREE_SHIPPING_THRESHOLD: {
      if (
        promotion.min_order_value != null &&
        subtotalGrossCents < promotion.min_order_value
      )
        return null;
      return shippingCostGrossCents > 0
        ? {
            promotion,
            discountCents: shippingCostGrossCents,
            base: "SHIPPING",
          }
        : null;
    }

    default:
      return null;
  }
};

const pickBestEffect = (effects: PromotionEffect[]): PromotionEffect | null => {
  return effects.reduce<PromotionEffect | null>((best, current) => {
    if (!best) return current;
    if (current.discountCents > best.discountCents) return current;
    if (
      current.discountCents === best.discountCents &&
      current.promotion.priority > best.promotion.priority
    )
      return current;
    return best;
  }, null);
};

const toApplied = (effect: PromotionEffect): AppliedPromotion => ({
  promotion_id: effect.promotion.id,
  name: effect.promotion.name,
  type: effect.promotion.type,
  discount_cents: effect.discountCents,
});

export const applyPromotions = ({
  promotions,
  items,
  subtotalGrossCents,
  shippingCostGrossCents,
  now,
}: ApplyPromotionsParams): ApplyPromotionsResult => {
  const effects = promotions
    .filter((promotion) => promotion.is_active && isWithinDateWindow(promotion, now))
    .map((promotion) =>
      getPromotionEffect(
        promotion,
        items,
        subtotalGrossCents,
        shippingCostGrossCents,
        now,
      ),
    )
    .filter((effect): effect is PromotionEffect => effect !== null);

  const bestOrder = pickBestEffect(
    effects.filter((effect) => effect.base === "ORDER"),
  );
  const bestShipping = pickBestEffect(
    effects.filter((effect) => effect.base === "SHIPPING"),
  );

  const applied: AppliedPromotion[] = [];
  if (bestOrder) applied.push(toApplied(bestOrder));
  if (bestShipping) applied.push(toApplied(bestShipping));

  return {
    orderDiscountCents: bestOrder?.discountCents ?? 0,
    shippingDiscountCents: bestShipping?.discountCents ?? 0,
    applied,
    orderStackableWithCoupon: bestOrder
      ? bestOrder.promotion.stackable_with_coupon
      : true,
    shippingStackableWithCoupon: bestShipping
      ? bestShipping.promotion.stackable_with_coupon
      : true,
  };
};
