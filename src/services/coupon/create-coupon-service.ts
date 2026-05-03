import z from "zod";

import { DiscountType } from "@/generated/prisma/client.js";
import { transformPriceToDatabase } from "@/helpers/price.js";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createCouponBodySchema } from "@/schemas/coupon-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type CreateCouponServiceRequest = z.infer<typeof createCouponBodySchema> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> & {
		establishmentId: EstablishmentID;
	};

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

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "coupons",
			paramsToForget
		});
	}
}
