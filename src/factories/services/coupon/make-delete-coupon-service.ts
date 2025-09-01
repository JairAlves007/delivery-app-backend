import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.ts";
import { DeleteCouponService } from "@/services/coupon/delete-coupon-service.ts";

export const makeDeleteCouponService = () => {
	const couponRepository = makeCouponRepository();
	return new DeleteCouponService(couponRepository);
};
