import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { transformPriceToDatabase } from "@/helpers/price.ts";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.ts";
import { updateCouponBodySchema } from "@/schemas/coupon-schema.ts";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.ts";
import { DiscountType } from "@prisma/client";
import z from "zod";

interface UpdateCouponServiceRequest
	extends z.infer<typeof updateCouponBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: number;
}

export class UpdateCouponService {
	private couponRepository: ICouponRepository;

	constructor(couponRepository: ICouponRepository) {
		this.couponRepository = couponRepository;
	}

	async handle({
		id,
		establishmentId,
		value,
		discountType: discount_type,
		startsAt: starts_at,
		endsAt: ends_at,
		maxUses: max_uses,
		usesPerUser: uses_per_user,
		paramsToForget,
		...data
	}: UpdateCouponServiceRequest) {
		await this.couponRepository.update({
			id,
			data: {
				...data,
				...(value && {
					value:
						discount_type === DiscountType.PERCENTAGE
							? value
							: transformPriceToDatabase(value)
				}),
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
			}
		});

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "coupons",
			paramsToForget
		});
	}
}
