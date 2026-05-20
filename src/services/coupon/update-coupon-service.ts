import z from "zod";

import { DiscountType } from "@/generated/prisma/client.js";
import { transformPriceToDatabase } from "@/helpers/price.js";
import type { ICouponRepository } from "@/interfaces/repositories/coupon-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateCouponBodySchema } from "@/schemas/coupon-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

interface UpdateCouponServiceRequest
	extends
		z.infer<typeof updateCouponBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
	establishmentId: EstablishmentID;
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
			filterParams: { establishment_id: establishmentId },
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
				uses_per_user
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "coupons",
			paramsToForget
		});
	}
}
