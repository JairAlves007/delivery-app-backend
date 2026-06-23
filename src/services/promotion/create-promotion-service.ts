import z from "zod";

import {
	CouponScopeType,
	DiscountType,
	type Prisma
} from "@/generated/prisma/client.js";
import { transformPriceToDatabase } from "@/helpers/price.js";
import type { IPromotionRepository } from "@/interfaces/repositories/promotion-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createPromotionBodySchema } from "@/schemas/promotion-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type CreatePromotionServiceRequest = z.infer<typeof createPromotionBodySchema> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> & {
		establishmentId: EstablishmentID;
	};

export class CreatePromotionService {
	private promotionRepository: IPromotionRepository;

	constructor(promotionRepository: IPromotionRepository) {
		this.promotionRepository = promotionRepository;
	}

	async handle({
		establishmentId,
		name,
		type,
		discountType: discount_type,
		value,
		scope,
		minOrderValue,
		buyQuantity: buy_quantity,
		payQuantity: pay_quantity,
		priority,
		stackableWithCoupon: stackable_with_coupon,
		isActive: is_active,
		startsAt: starts_at,
		endsAt: ends_at,
		productIds,
		categoryIds,
		windows,
		paramsToForget
	}: CreatePromotionServiceRequest) {
		const data: Prisma.PromotionCreateInput = {
			name,
			type,
			discount_type,
			value:
				value != null && discount_type === DiscountType.FIXED
					? transformPriceToDatabase(value)
					: value,
			scope,
			min_order_value:
				minOrderValue == null ? null : transformPriceToDatabase(minOrderValue),
			buy_quantity,
			pay_quantity,
			priority,
			stackable_with_coupon,
			is_active,
			starts_at,
			ends_at,
			establishment: { connect: { id: establishmentId } },
			windows: {
				create: windows.map(window => ({
					day_of_week: window.dayOfWeek,
					opens_at: window.opensAt,
					closes_at: window.closesAt
				}))
			},
			...(scope === CouponScopeType.PRODUCTS && {
				promotionProducts: {
					create: productIds.map(product_id => ({
						product: { connect: { id: product_id } }
					}))
				}
			}),
			...(scope === CouponScopeType.CATEGORIES && {
				promotionCategories: {
					create: categoryIds.map(category_id => ({
						category: { connect: { id: category_id } }
					}))
				}
			})
		};

		await this.promotionRepository.create(data);

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "promotions",
			paramsToForget
		});
	}
}
