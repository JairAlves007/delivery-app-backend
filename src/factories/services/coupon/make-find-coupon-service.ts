import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.js";
import { FindCouponService } from "@/services/coupon/find-coupon-service.js";

export const makeFindCouponService = () => {
  const couponRepository = makeCouponRepository();

  return new FindCouponService(couponRepository);
};
