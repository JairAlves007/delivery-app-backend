import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.ts";
import { ListCouponService } from "@/services/coupon/list-coupon-service.ts";

export const makeListCouponService = () => {
	const couponRepository = makeCouponRepository();
	return new ListCouponService(couponRepository);
};
