import { makeCouponRepository } from "@/factories/repositories/make-coupon-repository.js";
import { DeleteCouponService } from "@/services/coupon/delete-coupon-service.js";

export const makeDeleteCouponService = () => {
	const couponRepository = makeCouponRepository();
	return new DeleteCouponService(couponRepository);
};
