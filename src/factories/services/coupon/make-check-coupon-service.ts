import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.js";
import { CheckCouponService } from "@/services/coupon/check-coupon-service.js";

export const makeCheckCouponService = () => {
	const couponRepository = makeCouponRepository();
	return new CheckCouponService(couponRepository);
};
