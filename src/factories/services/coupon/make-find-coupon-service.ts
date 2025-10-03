import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.ts";
import { FindCouponService } from "@/services/coupon/find-coupon-service.ts";

export const makeFindCouponService = () => {
	const couponRepository = makeCouponRepository();

	return new FindCouponService(couponRepository);
};
