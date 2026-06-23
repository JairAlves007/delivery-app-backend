import z from "zod";

import { makeValidateAddonsFromOrderService } from "@/factories/services/order/validations/make-validate-addons-from-order-service.js";
import { makeValidateCombosFromOrderService } from "@/factories/services/order/validations/make-validate-combo-from-order-service.js";
import { makeValidateDeliveryFromOrderService } from "@/factories/services/order/validations/make-validate-delivery-from-order-service.js";
import { makeValidateProductFromOrderService } from "@/factories/services/order/validations/make-validate-product-from-order-service.js";
import { makeListActivePromotionsService } from "@/factories/services/promotion/make-list-active-promotions-service.js";
import { DiscountType, type PromotionType } from "@/generated/prisma/client.js";
import {
	getValueDiscounted,
	transformPriceFromDatabase
} from "@/helpers/price.js";
import { removeDuplicateItems } from "@/helpers/utils.js";
import type { quoteOrderBodySchema } from "@/schemas/order-schema.js";
import { calculateOrderPricing } from "@/services/order/pricing/calculate-order-pricing.js";
import type { OrderItems, OrderItemsToProcess } from "@/types/order.js";

type QuoteOrderServiceRequest = z.infer<typeof quoteOrderBodySchema>;

export interface QuoteOrderServiceResponse {
	subtotal: number;
	subtotal_gross: number;
	shipping_cost: number;
	shipping_cost_gross: number;
	order_discount: number;
	shipping_discount: number;
	coupon_discount: number;
	promotion_discount: number;
	promotions: {
		promotion_id: string;
		name: string;
		type: PromotionType;
		discount: number;
	}[];
	total: number;
}

export class QuoteOrderService {
	async handle({
		establishmentId,
		customerPhone,
		deliveryType,
		districtId,
		couponId,
		items,
		combos
	}: QuoteOrderServiceRequest): Promise<QuoteOrderServiceResponse> {
		const validateDeliveryService = makeValidateDeliveryFromOrderService();
		const validateProductService = makeValidateProductFromOrderService();
		const validateAddonsService = makeValidateAddonsFromOrderService();
		const listActivePromotionsService = makeListActivePromotionsService();
		const validateCombosService = makeValidateCombosFromOrderService();

		const itemsValidated: OrderItems[] = removeDuplicateItems(items);

		const [{ coupon, district }, promotions, combosToProcess] =
			await Promise.all([
				validateDeliveryService.handle({
					deliveryType,
					establishmentId,
					customerName: "",
					customerPhone: customerPhone ?? "",
					couponId,
					districtId,
					address: null
				}),
				listActivePromotionsService.handle({ establishmentId }),
				validateCombosService.handle({ establishmentId, combos })
			]);

		const combosSubtotalCents = combosToProcess.reduce(
			(acc, combo) => acc + combo.comboPriceCents * combo.quantity,
			0
		);

		const orderItemsToProcess: OrderItemsToProcess[] = await Promise.all(
			itemsValidated.map(async item => {
				const [product, addonsResult] = await Promise.all([
					validateProductService.handle({
						establishmentId,
						productId: item.id,
						productQuantity: item.quantity,
						weightGrams: item.weight_grams ?? null
					}),
					validateAddonsService.handle({
						establishmentId,
						productId: item.id,
						orderAddons: item.addonCategories
					})
				]);

				const discount = getValueDiscounted(
					DiscountType.PERCENTAGE,
					product.discount_percentage ?? 0,
					product.price
				);
				const price = product.price - discount;

				return {
					product: {
						...product,
						quantity: item.quantity,
						weight_grams: item.weight_grams ?? null,
						price
					},
					addons: addonsResult.addons,
					addonsSubtotalCents: addonsResult.addonsSubtotalCents
				};
			})
		);

		const breakdown = calculateOrderPricing({
			coupon,
			district,
			orderItemsToProcess,
			promotions,
			combosSubtotalCents
		});

		return {
			subtotal: transformPriceFromDatabase(breakdown.subtotalNetCents),
			subtotal_gross: transformPriceFromDatabase(breakdown.subtotalGrossCents),
			shipping_cost: transformPriceFromDatabase(breakdown.shippingCostNetCents),
			shipping_cost_gross: transformPriceFromDatabase(
				breakdown.shippingCostGrossCents
			),
			order_discount: transformPriceFromDatabase(breakdown.orderDiscountCents),
			shipping_discount: transformPriceFromDatabase(
				breakdown.shippingDiscountCents
			),
			coupon_discount: transformPriceFromDatabase(breakdown.couponDiscountCents),
			promotion_discount: transformPriceFromDatabase(
				breakdown.promotionDiscountCents
			),
			promotions: breakdown.appliedPromotions.map((promotion) => ({
				promotion_id: promotion.promotion_id,
				name: promotion.name,
				type: promotion.type,
				discount: transformPriceFromDatabase(promotion.discount_cents)
			})),
			total: transformPriceFromDatabase(breakdown.totalToPayCents)
		};
	}
}
