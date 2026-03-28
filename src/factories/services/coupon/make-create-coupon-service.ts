import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.js";
import { CreateCouponService } from "@/services/coupon/create-coupon-service.js";

export const makeCreateCouponService = () => {
	const couponRepository = makeCouponRepository();
	return new CreateCouponService(couponRepository);
};
