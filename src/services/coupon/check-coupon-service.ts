import { CouponExpired } from "@/errors/coupon/expired.ts";
import { CouponMaxUsesReached } from "@/errors/coupon/max-uses-reached.ts";
import { CouponNotFound } from "@/errors/coupon/not-found.ts";
import { CouponUserLimitReached } from "@/errors/coupon/user-limit-reached.ts";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";
import { checkCouponBodySchema } from "@/schemas/coupon-schema.ts";
import z from "zod";

type CheckCouponServiceRequest = z.infer<typeof checkCouponBodySchema> & {
	userId: string;
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
		userId
	}: CheckCouponServiceRequest): Promise<CheckCouponServiceResponse> {
		const now = new Date();
		const coupon = await this.couponRepository.check(
			code,
			establishmentId,
			userId
		);

		if (!coupon || (coupon.starts_at && coupon.starts_at > now))
			throw new CouponNotFound();

		if (coupon.ends_at && coupon.ends_at < now) throw new CouponExpired();

		if (coupon.max_uses && coupon.max_uses <= 0)
			throw new CouponMaxUsesReached();

		if (
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
