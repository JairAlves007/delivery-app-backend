import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.js";
import { UpdateCouponService } from "@/services/coupon/update-coupon-service.js";

export const makeUpdateCouponService = () => {
	const couponRepository = makeCouponRepository();
	return new UpdateCouponService(couponRepository);
};
