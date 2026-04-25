import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.js";
import { ListCouponService } from "@/services/coupon/list-coupon-service.js";

export const makeListCouponService = () => {
  const couponRepository = makeCouponRepository();
  return new ListCouponService(couponRepository);
};
