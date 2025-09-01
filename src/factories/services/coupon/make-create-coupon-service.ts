import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.ts";
import { CreateCouponService } from "@/services/coupon/create-coupon-service.ts";

export const makeCreateCouponService = () => {
	const couponRepository = makeCouponRepository();
	return new CreateCouponService(couponRepository);
};
