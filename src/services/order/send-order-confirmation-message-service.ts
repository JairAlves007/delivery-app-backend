import {
	AddonPricingStrategy,
	AddonType,
	CouponType,
	OrderMessageTrigger,
	ProductPricingMode
} from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { formatDateToHumanReadable } from "@/helpers/date.js";
import {
	formatWeight,
	getAddonStrategyLabel,
	getCouponAppliedLabel,
	getDeliveryTypeLabel,
	getFractionLabel,
	getPaymentMethodLabel
} from "@/helpers/order.js";
import {
	transformPriceFromDatabase,
	transformPriceToHumanReadable
} from "@/helpers/price.js";
import { enqueueWhatsAppMessage } from "@/queues/whatsapp-queue.js";
import { calculateAddonPricing } from "@/services/order/pricing/calculate-addon-pricing.js";
import {
	calculateOrderPricing,
	type OrderItemPricing,
	type OrderPricingBreakdown
} from "@/services/order/pricing/calculate-order-pricing.js";
import type { AddonFromRepository } from "@/types/addon.js";
import type {
	OrderAddonsToProcess,
	OrderItemsToProcess,
	SendOrderConfirmationMessageParams
} from "@/types/order.js";

type AddonGroup = {
	categoryId: number;
	categoryName: string;
	type: AddonType;
	pricingStrategy: AddonPricingStrategy;
	partsCount: number | null;
	addons: OrderAddonsToProcess[];
};

const formatCents = (cents: number): string =>
	transformPriceToHumanReadable(transformPriceFromDatabase(cents));

export class SendOrderConfirmationMessageService {
	private groupAddonsByCategory(
		addons: OrderAddonsToProcess[]
	): AddonGroup[] {
		const map = new Map<number, AddonGroup>();
		for (const addon of addons) {
			const category = (addon as unknown as AddonFromRepository).category;
			if (!category) continue;
			const existing = map.get(category.id);
			if (existing) {
				existing.addons.push(addon);
			} else {
				map.set(category.id, {
					categoryId: category.id,
					categoryName: category.name,
					type: category.type,
					pricingStrategy: category.pricing_strategy,
					partsCount: category.parts_count,
					addons: [addon]
				});
			}
		}
		return Array.from(map.values());
	}

	private renderAddonItem(
		group: AddonGroup,
		addon: OrderAddonsToProcess
	): string {
		const subSections = Constants.ORDER_SUB_SECTIONS_MESSAGE_TEMPLATES;
		if (group.pricingStrategy === AddonPricingStrategy.NONE) {
			return subSections.addonItemNone.replaceAll("{addon_name}", addon.name);
		}
		switch (group.type) {
			case AddonType.QUANTITY:
				return subSections.addonItemQuantity
					.replaceAll("{addon_name}", addon.name)
					.replaceAll("{addon_unit_price}", formatCents(addon.price))
					.replaceAll("{addon_quantity}", addon.quantity.toString());
			case AddonType.SINGLE_CHOICE:
				return subSections.addonItemSingle.replaceAll(
					"{addon_name}",
					addon.name
				);
			case AddonType.MULTIPLE_CHOICE:
				return subSections.addonItemMultiple
					.replaceAll("{addon_name}", addon.name)
					.replaceAll("{addon_price}", formatCents(addon.price));
			case AddonType.FRACTIONAL:
				return subSections.addonItemFractional
					.replaceAll(
						"{fraction_label}",
						getFractionLabel(addon.quantity, group.partsCount)
					)
					.replaceAll("{addon_name}", addon.name)
					.replaceAll("{addon_price}", formatCents(addon.price));
		}
	}

	private renderAddonBlocks(item: OrderItemsToProcess): string {
		const subSections = Constants.ORDER_SUB_SECTIONS_MESSAGE_TEMPLATES;
		const groups = this.groupAddonsByCategory(item.addons);
		if (groups.length === 0) return "";
		return groups
			.map(group => {
				const list = group.addons
					.map(addon => this.renderAddonItem(group, addon))
					.join("\n");
				const subtotalCents = calculateAddonPricing({
					pricingStrategy: group.pricingStrategy,
					type: group.type,
					partsCount: group.partsCount,
					addons: group.addons.map(a => ({
						priceCents: a.price,
						quantity: a.quantity
					}))
				});
				return subSections.addonCategoryBlock
					.replaceAll("{category_name}", group.categoryName)
					.replaceAll(
						"{category_strategy_label}",
						getAddonStrategyLabel(group.pricingStrategy)
					)
					.replaceAll("{category_addons_list}", list)
					.replaceAll("{category_subtotal}", formatCents(subtotalCents));
			})
			.join("");
	}

	private renderProduct(
		item: OrderItemsToProcess,
		pricing: OrderItemPricing
	): string {
		const subSections = Constants.ORDER_SUB_SECTIONS_MESSAGE_TEMPLATES;
		const addonBlocks = this.renderAddonBlocks(item);
		const hasAddons = item.addons.length > 0;

		const isWeighted =
			item.product.pricing_mode === ProductPricingMode.PER_WEIGHT &&
			item.product.weight_grams != null &&
			item.product.price_per_100g != null;

		if (isWeighted) {
			const weightGrams = item.product.weight_grams as number;
			const pricePer100g = item.product.price_per_100g as number;
			return subSections.productWeighted
				.replaceAll("{product_name}", item.product.name)
				.replaceAll("{price_per_100g}", formatCents(pricePer100g))
				.replaceAll("{weight_grams_human}", formatWeight(weightGrams))
				.replaceAll("{product_subtotal}", formatCents(pricing.productBaseCents))
				.replaceAll("{item_total}", formatCents(pricing.itemTotalCents))
				.replaceAll("{none_addons}", hasAddons ? "" : "Nenhum")
				.replaceAll("{addons_section}", addonBlocks);
		}

		return subSections.productUnit
			.replaceAll("{product_name}", item.product.name)
			.replaceAll("{product_quantity}", item.product.quantity.toString())
			.replaceAll("{product_price}", formatCents(item.product.price))
			.replaceAll("{product_subtotal}", formatCents(pricing.productBaseCents))
			.replaceAll("{item_total}", formatCents(pricing.itemTotalCents))
			.replaceAll("{none_addons}", hasAddons ? "" : "Nenhum")
			.replaceAll("{addons_section}", addonBlocks);
	}

	private renderDiscountLine(
		coupon: SendOrderConfirmationMessageParams["coupon"],
		breakdown: OrderPricingBreakdown
	): string {
		if (!coupon) return "";
		const subSections = Constants.ORDER_SUB_SECTIONS_MESSAGE_TEMPLATES;
		if (
			coupon.type === CouponType.ORDER &&
			breakdown.orderDiscountCents > 0
		) {
			return subSections.discountOrder.replaceAll(
				"{discount_value}",
				formatCents(breakdown.orderDiscountCents)
			);
		}
		if (
			coupon.type === CouponType.SHIPPING &&
			breakdown.shippingDiscountCents > 0
		) {
			return subSections.discountShipping.replaceAll(
				"{discount_value}",
				formatCents(breakdown.shippingDiscountCents)
			);
		}
		return "";
	}

	private generateMessage({
		customerName,
		customerPhone,
		deliveryType,
		paymentMethod,
		changeAmount,
		comment,
		address,
		coupon,
		district,
		orderItemsToProcess
	}: SendOrderConfirmationMessageParams): string {
		const subSectionsTemplates = Constants.ORDER_SUB_SECTIONS_MESSAGE_TEMPLATES;
		const template = Constants.ORDER_MESSAGE_TEMPLATE;

		const breakdown = calculateOrderPricing({
			coupon,
			district,
			orderItemsToProcess
		});

		let orderItemsMessage = "";
		orderItemsToProcess.forEach((item, index) => {
			orderItemsMessage +=
				this.renderProduct(item, breakdown.items[index]) + "\n\n";
		});

		return template
			.replaceAll("{order_items}", orderItemsMessage.trim())
			.replaceAll("{customer_name}", customerName)
			.replaceAll("{customer_phone}", this.applyPhoneMask(customerPhone))
			.replaceAll("{delivery_type}", getDeliveryTypeLabel(deliveryType))
			.replaceAll("{payment_method}", getPaymentMethodLabel(paymentMethod))
			.replaceAll(
				"{shipping_cost}",
				formatCents(breakdown.shippingCostGrossCents)
			)
			.replaceAll("{subtotal}", formatCents(breakdown.subtotalGrossCents))
			.replaceAll("{total_price}", formatCents(breakdown.totalToPayCents))
			.replaceAll("{order_created_at}", formatDateToHumanReadable(new Date()))
			.replaceAll(
				"{address}",
				!!address && !!district
					? subSectionsTemplates.address
							.replaceAll("{reference_point_section}", "")
							.replaceAll(
								"{address_simplified}",
								[
									address.street,
									address.number,
									`${address.city} - ${address.state}`
								].join(", ")
							)
							.replaceAll("{district_name}", district.name)
					: ""
			)
			.replaceAll(
				"{coupon}",
				coupon
					? subSectionsTemplates.coupon
							.replaceAll("{coupon_code}", coupon.code)
							.replaceAll(
								"{coupon_value}",
								getCouponAppliedLabel(
									coupon.type,
									coupon.discount_type,
									coupon.value
								)
							)
					: ""
			)
			.replaceAll("{discount}", this.renderDiscountLine(coupon, breakdown))
			.replaceAll(
				"{change_amount}",
				changeAmount
					? subSectionsTemplates.changeAmount.replaceAll(
							"{change_amount_value}",
							formatCents(changeAmount)
						)
					: ""
			)
			.replaceAll(
				"{comment}",
				comment
					? subSectionsTemplates.comment.replaceAll("{comment_value}", comment)
					: ""
			)
			.replaceAll("\t", "");
	}

	private applyPhoneMask(phone: string): string {
		const phoneLength = phone.length;

		if (phoneLength < 10) return phone;

		const phoneRegex =
			phoneLength === 11 ? /(\d{2})(\d{5})(\d{4})/ : /(\d{2})(\d{4})(\d{4})/;

		return phone.replace(phoneRegex, "($1) $2-$3");
	}

	async handle(params: SendOrderConfirmationMessageParams) {
		const message = this.generateMessage(params);

		const breakdown = calculateOrderPricing({
			coupon: params.coupon,
			district: params.district,
			orderItemsToProcess: params.orderItemsToProcess
		});

		await enqueueWhatsAppMessage({
			establishmentId: params.establishmentId,
			orderId: params.orderId,
			trigger: OrderMessageTrigger.ORDER_CONFIRMED,
			toPhone: params.customerPhone,
			context: {
				customer_name: params.customerName,
				customer_phone: this.applyPhoneMask(params.customerPhone),
				order_id: params.orderId,
				order_total: formatCents(breakdown.totalToPayCents),
				delivery_type: getDeliveryTypeLabel(params.deliveryType),
				establishment_name: params.establishmentName,
				status_label: "Preparando...",
				estimated_time: ""
			},
			fallbackMessage: message
		});
	}
}
