import { CouponNotFound } from "@/errors/coupon/not-found.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { makeCheckCouponService } from "@/factories/services/coupon/make-check-coupon-service.ts";
import { makeFindCouponService } from "@/factories/services/coupon/make-find-coupon-service.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
import type { UserID } from "@/types/user.ts";
import type { Coupon } from "@prisma/client";

type ValidateCouponFromOrderServiceRequest = {
	establishmentId: EstablishmentID;
	userId: UserID;
	couponId: number;
};

export class ValidateCouponFromOrderService {
	async handle({
		establishmentId,
		couponId,
		userId
	}: ValidateCouponFromOrderServiceRequest): Promise<Coupon> {
		const filterParams = { establishment_id: establishmentId };

		const findCouponService = makeFindCouponService();
		const coupon = await findCouponService.handle({
			id: couponId,
			filterParams
		});

		if (!coupon) throw new CouponNotFound();

		const checkCoupon = makeCheckCouponService();

		await checkCoupon.handle({
			code: coupon.code,
			establishmentId,
			userId
		});

		return coupon;
	}
}
