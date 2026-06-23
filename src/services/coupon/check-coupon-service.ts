import z from "zod";

import { CouponExpired } from "@/errors/coupon/expired.js";
import { CouponInactive } from "@/errors/coupon/inactive.js";
import { CouponMaxUsesReached } from "@/errors/coupon/max-uses-reached.js";
import { CouponMinOrderNotReached } from "@/errors/coupon/min-order-not-reached.js";
import { CouponNotFound } from "@/errors/coupon/not-found.js";
import { CouponUserLimitReached } from "@/errors/coupon/user-limit-reached.js";
import type {
	CouponScopeType,
	CouponType
} from "@/generated/prisma/client.js";
import { DiscountType } from "@/generated/prisma/client.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.js";
import { checkCouponBodySchema } from "@/schemas/coupon-schema.js";
import type { EstablishmentID } from "@/types/establishment.js";

type CheckCouponServiceRequest = z.infer<typeof checkCouponBodySchema> & {
	customerPhone?: string | null;
	establishmentId: EstablishmentID;
};

interface CheckCouponServiceResponse {
	id: string;
	code: string;
	type: CouponType;
	discount_type: DiscountType;
	value: number;
	scope: CouponScopeType;
	min_order_value: number | null;
	per_customer_limit: number | null;
	ends_at: Date | null;
}

export class CheckCouponService {
	private couponRepository: ICouponRepository;

	constructor(couponRepository: ICouponRepository) {
		this.couponRepository = couponRepository;
	}

	async handle({
		code,
		establishmentId,
		customerPhone,
		subtotal
	}: CheckCouponServiceRequest): Promise<CheckCouponServiceResponse> {
		const now = new Date();
		const coupon = await this.couponRepository.check(
			code,
			establishmentId,
			customerPhone
		);

		if (!coupon || (coupon.starts_at && coupon.starts_at > now))
			throw new CouponNotFound();

		if (!coupon.is_active) throw new CouponInactive();

		if (coupon.ends_at && coupon.ends_at < now) throw new CouponExpired();

		if (coupon.max_uses != null && coupon._count.userCoupons >= coupon.max_uses)
			throw new CouponMaxUsesReached();

		if (
			customerPhone &&
			coupon.per_customer_limit != null &&
			coupon.userCoupons.length >= coupon.per_customer_limit
		)
			throw new CouponUserLimitReached();

		if (
			subtotal != null &&
			coupon.min_order_value != null &&
			subtotal < transformPriceFromDatabase(coupon.min_order_value)
		)
			throw new CouponMinOrderNotReached();

		return {
			id: coupon.id,
			code: coupon.code,
			type: coupon.type,
			discount_type: coupon.discount_type,
			value:
				coupon.discount_type === DiscountType.FIXED
					? transformPriceFromDatabase(coupon.value)
					: coupon.value,
			scope: coupon.scope,
			min_order_value:
				coupon.min_order_value == null
					? null
					: transformPriceFromDatabase(coupon.min_order_value),
			per_customer_limit: coupon.per_customer_limit,
			ends_at: coupon.ends_at
		};
	}
}
