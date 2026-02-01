import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { DiscountType } from "@/generated/prisma/client.ts";
import { transformPriceToDatabase } from "@/helpers/price.ts";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";
import { createCouponBodySchema } from "@/schemas/coupon-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import z from "zod";

type CreateCouponServiceRequest = z.infer<typeof createCouponBodySchema> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

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
		paramsToForget,
		...data
	}: CreateCouponServiceRequest) {
		await this.couponRepository.create({
			...data,
			value:
				discount_type === DiscountType.PERCENTAGE
					? value
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

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "coupons",
			paramsToForget
		});
	}
}
