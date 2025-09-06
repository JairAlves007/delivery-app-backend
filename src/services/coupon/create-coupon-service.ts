import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { transformPriceToDatabase } from "@/helpers/price.ts";
import { transformValueToPercentage } from "@/helpers/utils.ts";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";
import { createCouponBodySchema } from "@/schemas/coupon-schema.ts";
import { DiscountType } from "@prisma/client";
import z from "zod";

type CreateCouponServiceRequest = z.infer<typeof createCouponBodySchema>;

export class CreateCouponService {
	private couponRepository: ICouponRepository;

	constructor(couponRepository: ICouponRepository) {
		this.couponRepository = couponRepository;
	}

	async handle({
		establishmentId,
		value,
		discountType: discount_type,
		startsAt: starts_at,
		endsAt: ends_at,
		maxUses: max_uses,
		usesPerUser: uses_per_user,
		...data
	}: CreateCouponServiceRequest) {
		const cache = makeCache();

		await this.couponRepository.create({
			...data,
			value:
				discount_type === DiscountType.PERCENTAGE
					? transformValueToPercentage(value)
					: transformPriceToDatabase(value),
			discount_type,
			starts_at,
			ends_at,
			max_uses,
			uses_per_user,
			establishment: {
				connect: {
					id: establishmentId
				}
			}
		});

		await cache.forgetKeysContaining(cache.keys.coupons);
	}
}
