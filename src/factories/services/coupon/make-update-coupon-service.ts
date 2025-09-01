import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.ts";
import { UpdateCouponService } from "@/services/coupon/update-coupon-service.ts";

export const makeUpdateCouponService = () => {
	const couponRepository = makeCouponRepository();
	return new UpdateCouponService(couponRepository);
};
