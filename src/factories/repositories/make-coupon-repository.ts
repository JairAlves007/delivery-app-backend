import { CouponPrismaRepository } from "@/repositories/coupon-prisma-repository.js";

export const makeCouponRepository = () => {
  return new CouponPrismaRepository();
};
