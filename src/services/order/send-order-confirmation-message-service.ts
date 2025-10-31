import Constants from "@/helpers/constants.ts";
import { formatDateToHumanReadable } from "@/helpers/date.ts";
import {
	getCouponAppliedLabel,
	getDeliveryTypeLabel,
	getPaymentMethodLabel
} from "@/helpers/order.ts";
import { transformPriceToHumanReadable } from "@/helpers/price.ts";
import type { BuildOrderItemsParams } from "@/types/order.ts";

export class SendOrderConfirmationMessageService {
	private generateMessage({
		user,
		deliveryType,
		paymentMethod,
		changeAmount,
		comment,
		contactPhone,
		address,
		coupon,
		couponDiscount,
		district,
		shippingCost,
		subtotal,
		orderItemsToProcess
	}: BuildOrderItemsParams): string {
		const subSectionsTemplates = Constants.ORDER_SUB_SECTIONS_MESSAGE_TEMPLATES;
		let template = Constants.ORDER_MESSAGE_TEMPLATE;

		if (!!address?.reference_point) {
			subSectionsTemplates.address = subSectionsTemplates.address.replaceAll(
				"{reference_point_section}",
				subSectionsTemplates.referencePoint.replaceAll(
					"{reference_point}",
					address.reference_point
				)
			);
		}

		let orderItemsMessage = "";

		orderItemsToProcess.forEach(item => {
			let itemMessage = subSectionsTemplates.product
				.replaceAll("{product_name}", item.product.name)
				.replaceAll("{product_quantity}", item.product.quantity.toString())
				.replaceAll(
					"{product_price}",
					transformPriceToHumanReadable(
						item.product.price * item.product.quantity
					)
				);

			if (!!item.addons && item.addons.length > 0) {
				let addonMessage = "";

				item.addons.forEach(addon => {
					addonMessage += subSectionsTemplates.addon
						.replaceAll("{addon_quantity}", addon.quantity.toString())
						.replaceAll("{addon_name}", addon.name)
						.replaceAll(
							"{addon_price}",
							transformPriceToHumanReadable(addon.price * addon.quantity)
						);
				});

				itemMessage =
					itemMessage
						.replaceAll("{none_addons}", "")
						.replaceAll("{addons_section}", addonMessage) + "\n\n";
			} else {
				itemMessage = itemMessage
					.replaceAll("{none_addons}", "Nenhum")
					.replaceAll("{addons_section}", "");
			}

			orderItemsMessage += itemMessage;
		});

		return template
			.replaceAll("{order_items}", orderItemsMessage.trim())
			.replaceAll("{customer_name}", user.name)
			.replaceAll(
				"{customer_phone}",
				this.applyPhoneMask(!!address ? address.phone : contactPhone ?? "")
			)
			.replaceAll("{delivery_type}", getDeliveryTypeLabel(deliveryType))
			.replaceAll("{payment_method}", getPaymentMethodLabel(paymentMethod))
			.replaceAll(
				"{shipping_cost}",
				transformPriceToHumanReadable(shippingCost)
			)
			.replaceAll("{subtotal}", transformPriceToHumanReadable(subtotal))
			.replaceAll(
				"{total_price}",
				transformPriceToHumanReadable(subtotal + shippingCost)
			)
			.replaceAll("{order_created_at}", formatDateToHumanReadable(new Date()))
			.replaceAll(
				"{address}",
				!!address && !!district
					? subSectionsTemplates.address
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
				!!coupon
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
			.replaceAll(
				"{discount}",
				!!coupon
					? subSectionsTemplates.discount.replaceAll(
							"{discount_value}",
							transformPriceToHumanReadable(couponDiscount)
					  )
					: ""
			)
			.replaceAll(
				"{change_amount}",
				changeAmount
					? subSectionsTemplates.changeAmount.replaceAll(
							"{change_amount_value}",
							transformPriceToHumanReadable(changeAmount)
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

	async handle(params: BuildOrderItemsParams) {
		// TODO: Implement message sending via WhatsApp Business API
		const message = this.generateMessage(params);

		console.log({ message });
	}
}
