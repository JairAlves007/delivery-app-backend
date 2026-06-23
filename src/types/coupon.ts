import { Prisma } from "@/generated/prisma/client.js";

export type ValidationReason =
  | "VALID"
  | "NOT_FOUND"
  | "EXPIRED"
  | "MAX_USES_REACHED"
  | "USER_LIMIT_REACHED"
  | "INACTIVE"
  | "MIN_ORDER_NOT_REACHED";

export type CouponWithUserCoupons = Prisma.CouponGetPayload<{
  include: {
    userCoupons: true;
    _count: { select: { userCoupons: true } };
  };
}>;

export type CouponWithScope = Prisma.CouponGetPayload<{
  include: {
    couponProducts: { select: { product_id: true } };
    couponCategories: { select: { category_id: true } };
  };
}>;
