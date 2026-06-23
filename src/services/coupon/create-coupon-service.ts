import z from "zod";

import { CouponScopeType, DiscountType } from "@/generated/prisma/client.js";
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
		scope,
		minOrderValue,
		perCustomerLimit: per_customer_limit,
		isActive: is_active,
		productIds,
		categoryIds,
		startsAt: starts_at,
		endsAt: ends_at,
		maxUses: max_uses,
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
			scope,
			min_order_value:
				minOrderValue == null ? null : transformPriceToDatabase(minOrderValue),
			per_customer_limit,
			is_active,
			starts_at,
			ends_at,
			max_uses,
			establishment: {
				connect: {
					id: establishmentId
				}
			},
			...(scope === CouponScopeType.PRODUCTS && {
				couponProducts: {
					create: productIds.map((product_id) => ({
						product: { connect: { id: product_id } }
					}))
				}
			}),
			...(scope === CouponScopeType.CATEGORIES && {
				couponCategories: {
					create: categoryIds.map((category_id) => ({
						category: { connect: { id: category_id } }
					}))
				}
			})
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "coupons",
			paramsToForget
		});
	}
}
