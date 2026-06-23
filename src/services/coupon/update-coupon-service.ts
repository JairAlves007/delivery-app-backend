import z from "zod";

import {
	CouponScopeType,
	DiscountType,
	type Prisma
} from "@/generated/prisma/client.js";
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

	private buildScopeData(
		scope?: CouponScopeType,
		productIds?: string[],
		categoryIds?: string[]
	): Prisma.CouponUpdateInput {
		if (!scope) return {};

		return {
			couponProducts: {
				deleteMany: {},
				...(scope === CouponScopeType.PRODUCTS && {
					create: (productIds ?? []).map((product_id) => ({
						product: { connect: { id: product_id } }
					}))
				})
			},
			couponCategories: {
				deleteMany: {},
				...(scope === CouponScopeType.CATEGORIES && {
					create: (categoryIds ?? []).map((category_id) => ({
						category: { connect: { id: category_id } }
					}))
				})
			}
		};
	}

	async handle({
		id,
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
				scope,
				...(minOrderValue !== undefined && {
					min_order_value:
						minOrderValue == null
							? null
							: transformPriceToDatabase(minOrderValue)
				}),
				per_customer_limit,
				is_active,
				starts_at,
				ends_at,
				max_uses,
				...this.buildScopeData(scope, productIds, categoryIds)
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "coupons",
			paramsToForget
		});
	}
}
