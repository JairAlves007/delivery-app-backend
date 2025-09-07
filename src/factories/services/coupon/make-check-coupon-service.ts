import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.ts";
import { CheckCouponService } from "@/services/coupon/check-coupon-service.ts";

export const makeCheckCouponService = () => {
	const couponRepository = makeCouponRepository();
	return new CheckCouponService(couponRepository);
};
