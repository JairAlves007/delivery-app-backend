import z from "zod";

import {
	CouponScopeType,
	DiscountType,
	type Prisma
} from "@/generated/prisma/client.js";
import { transformPriceToDatabase } from "@/helpers/price.js";
import type { IPromotionRepository } from "@/interfaces/repositories/promotion-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updatePromotionBodySchema } from "@/schemas/promotion-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

interface UpdatePromotionServiceRequest
	extends
		z.infer<typeof updatePromotionBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
	establishmentId: EstablishmentID;
}

export class UpdatePromotionService {
	private promotionRepository: IPromotionRepository;

	constructor(promotionRepository: IPromotionRepository) {
		this.promotionRepository = promotionRepository;
	}

	private buildScopeData(
		scope?: CouponScopeType,
		productIds?: string[],
		categoryIds?: string[]
	): Prisma.PromotionUpdateInput {
		if (!scope) return {};

		return {
			promotionProducts: {
				deleteMany: {},
				...(scope === CouponScopeType.PRODUCTS && {
					create: (productIds ?? []).map(product_id => ({
						product: { connect: { id: product_id } }
					}))
				})
			},
			promotionCategories: {
				deleteMany: {},
				...(scope === CouponScopeType.CATEGORIES && {
					create: (categoryIds ?? []).map(category_id => ({
						category: { connect: { id: category_id } }
					}))
				})
			}
		};
	}

	async handle({
		id,
		establishmentId,
		discountType: discount_type,
		value,
		scope,
		minOrderValue,
		buyQuantity: buy_quantity,
		payQuantity: pay_quantity,
		stackableWithCoupon: stackable_with_coupon,
		isActive: is_active,
		startsAt: starts_at,
		endsAt: ends_at,
		productIds,
		categoryIds,
		windows,
		paramsToForget,
		...data
	}: UpdatePromotionServiceRequest) {
		await this.promotionRepository.update({
			id,
			filterParams: { establishment_id: establishmentId },
			data: {
				...data,
				discount_type,
				...(value !== undefined && {
					value:
						value != null && discount_type === DiscountType.FIXED
							? transformPriceToDatabase(value)
							: value
				}),
				scope,
				...(minOrderValue !== undefined && {
					min_order_value:
						minOrderValue == null
							? null
							: transformPriceToDatabase(minOrderValue)
				}),
				buy_quantity,
				pay_quantity,
				stackable_with_coupon,
				is_active,
				starts_at,
				ends_at,
				...(windows !== undefined && {
					windows: {
						deleteMany: {},
						create: windows.map(window => ({
							day_of_week: window.dayOfWeek,
							opens_at: window.opensAt,
							closes_at: window.closesAt
						}))
					}
				}),
				...this.buildScopeData(scope, productIds, categoryIds)
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "promotions",
			paramsToForget
		});
	}
}
