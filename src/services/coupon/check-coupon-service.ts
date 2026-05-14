import z from "zod";

import { CouponExpired } from "@/errors/coupon/expired.js";
import { CouponMaxUsesReached } from "@/errors/coupon/max-uses-reached.js";
import { CouponNotFound } from "@/errors/coupon/not-found.js";
import { CouponUserLimitReached } from "@/errors/coupon/user-limit-reached.js";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.js";
import { checkCouponBodySchema } from "@/schemas/coupon-schema.js";
import type { EstablishmentID } from "@/types/establishment.js";

type CheckCouponServiceRequest = z.infer<typeof checkCouponBodySchema> & {
	customerPhone?: string | null;
	establishmentId: EstablishmentID;
};

interface CheckCouponServiceResponse {
	isValid: boolean;
	code: string | null;
}

export class CheckCouponService {
	private couponRepository: ICouponRepository;

	constructor(couponRepository: ICouponRepository) {
		this.couponRepository = couponRepository;
	}

	async handle({
		code,
		establishmentId,
		customerPhone
	}: CheckCouponServiceRequest): Promise<CheckCouponServiceResponse> {
		const now = new Date();
		const coupon = await this.couponRepository.check(
			code,
			establishmentId,
			customerPhone
		);

		if (!coupon || (coupon.starts_at && coupon.starts_at > now))
			throw new CouponNotFound();

		if (coupon.ends_at && coupon.ends_at < now) throw new CouponExpired();

		if (coupon.max_uses && coupon.max_uses <= 0)
			throw new CouponMaxUsesReached();

		if (
			customerPhone &&
			coupon.uses_per_user &&
			coupon.uses_per_user <= coupon.userCoupons.length
		) {
			throw new CouponUserLimitReached();
		}

		return {
			isValid: true,
			code: coupon.code
		};
	}
}
