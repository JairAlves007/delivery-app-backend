import type { Prisma, PromotionType } from "@/generated/prisma/client.js";

export type PromotionWithRelations = Prisma.PromotionGetPayload<{
  include: {
    windows: true;
    promotionProducts: { select: { product_id: true } };
    promotionCategories: { select: { category_id: true } };
  };
}>;

export type AppliedPromotion = {
  promotion_id: string;
  name: string;
  type: PromotionType;
  discount_cents: number;
};

export type PromotionPricingItem = {
  productId: string;
  categoryId: string;
  quantity: number;
  itemTotalCents: number;
};

export type ApplyPromotionsResult = {
  orderDiscountCents: number;
  shippingDiscountCents: number;
  applied: AppliedPromotion[];
  orderStackableWithCoupon: boolean;
  shippingStackableWithCoupon: boolean;
};
