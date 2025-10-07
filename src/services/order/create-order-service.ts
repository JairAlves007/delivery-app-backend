import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import type {
	OrderAddonsToProcess,
	OrderIntent,
	OrderItems,
	OrderItemsToProcess
} from "@/types/order.ts";
import {
	DeliveryType,
	DiscountType,
	OrderStatusType,
	PaymentMethodType,
	type Coupon,
	type District,
	type Prisma
} from "@prisma/client";
import type { UserAddressWithDefault } from "@/types/address.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
import type { UserWithRole } from "@/types/user.ts";
import { makeValidateEstablishmentFromOrderService } from "@/factories/services/order/validations/make-validate-establishment-from-order-service.ts";
import {
	formatDateToHumanReadable,
	removeDuplicateItems
} from "@/helpers/utils.ts";
import { makeValidateProductFromOrderService } from "@/factories/services/order/validations/make-validate-product-from-order-service.ts";
import {
	getValueDiscounted,
	transformPriceFromDatabase,
	transformPriceToDatabase,
	transformPriceToHumanReadable
} from "@/helpers/price.ts";
import { makeFindUserService } from "@/factories/services/user/make-find-user-service.ts";
import { UserNotFound } from "@/errors/user/user-not-found.ts";
import {
	getStatusLabel,
	getCouponLabels,
	getDeliveryTypeLabel,
	getPaymentMethodLabel
} from "@/helpers/order.ts";
import { makeValidateDeliveryFromOrderService } from "@/factories/services/order/validations/make-validate-delivery-from-order-service.ts";
import { makeValidateAddonsFromOrderService } from "@/factories/services/order/validations/make-validate-addons-from-order-service.ts";
import { makeCalculateCouponDiscountFromOrderService } from "@/factories/services/order/validations/make-calculate-coupon-discount-from-order-service.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import Constants from "@/helpers/constants.ts";

type BuildOrderItemsParams = {
	user: UserWithRole;
	comment?: string | null;
	deliveryType: DeliveryType;
	paymentMethod: PaymentMethodType;
	establishmentId: EstablishmentID;
	changeAmount?: number | null;
	couponDiscount: number;
	coupon: Coupon | null;
	address: UserAddressWithDefault | null;
	district: District | null;
	shippingCost: number;
	subtotal: number;
	orderItemsToProcess: OrderItemsToProcess[];
};

export class CreateOrderService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	private getOrderCouponInputData(
		coupon: Coupon | null
	): Partial<Prisma.OrderCreateInput> | undefined {
		if (!!!coupon) return undefined;

		return {
			coupon: {
				connect: {
					id: coupon.id
				}
			},
			orderCoupon: {
				create: {
					code: coupon.code,
					discount_type: coupon.discount_type,
					discount_value: coupon.value
				}
			}
		};
	}

	private getOrderAddressDistrictInputData(
		address: UserAddressWithDefault | null,
		district: District | null
	): Partial<Prisma.OrderCreateInput> | undefined {
		if (!!!address || !!!district) return undefined;

		const { address_id, city, street, number, postal_code, state } = address;
		const { id: district_id, name: district_name, shipping_cost } = district;

		return {
			orderDeliveryAddress: {
				create: {
					city,
					number,
					postal_code,
					state,
					street,
					district_name,
					shipping_cost,
					address: {
						connect: {
							id: address_id
						}
					},
					district: {
						connect: {
							id: district_id
						}
					}
				}
			}
		};
	}

	private buildOrderItems({
		user,
		deliveryType,
		paymentMethod,
		changeAmount,
		establishmentId,
		comment,
		address,
		coupon,
		district,
		shippingCost,
		subtotal,
		orderItemsToProcess
	}: BuildOrderItemsParams): Prisma.OrderCreateInput {
		const couponData = this.getOrderCouponInputData(coupon);

		const orderAddress = this.getOrderAddressDistrictInputData(
			address,
			district
		);

		return {
			comment,
			customer_name: user.name,
			delivery_type: deliveryType,
			payment_method: paymentMethod,
			shipping_fee: shippingCost,
			subtotal,
			change_amount: changeAmount,
			establishment: {
				connect: {
					id: establishmentId
				}
			},
			user: {
				connect: {
					id: user.id
				}
			},
			items: {
				createMany: {
					data: orderItemsToProcess.map(item => ({
						product_id: item.product.id,
						product_name: item.product.name,
						product_price: item.product.price,
						quantity: item.product.quantity
					}))
				}
			},
			statuses: {
				create: {
					label: getStatusLabel(OrderStatusType.PREPARING),
					value: OrderStatusType.PREPARING
				}
			},
			...orderAddress,
			...couponData
		};
	}

	private makeOrderMessage({
		user,
		deliveryType,
		paymentMethod,
		changeAmount,
		comment,
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
					transformPriceToHumanReadable(item.product.price)
				);

			if (!!item.addons && item.addons.length > 0) {
				let addonMessage = "";

				item.addons.forEach(addon => {
					addonMessage += subSectionsTemplates.addon
						.replaceAll("{addon_name}", addon.name)
						.replaceAll(
							"{addon_price}",
							transformPriceToHumanReadable(addon.price)
						);
				});

				itemMessage = itemMessage
					.replaceAll("{none_addons}", "")
					.replaceAll("{addons_section}", addonMessage);
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
							.replaceAll("{address_phone}", address.phone)
					: ""
			)
			.replaceAll(
				"{coupon}",
				!!coupon
					? subSectionsTemplates.coupon
							.replaceAll("{coupon_code}", coupon.code)
							.replaceAll(
								"{coupon_value}",
								getCouponLabels(coupon.type, coupon.discount_type, coupon.value)
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

	async handle({
		deliveryType,
		paymentMethod,
		changeAmount,
		couponId,
		addressId,
		establishmentId,
		districtId,
		userId,
		comment,
		items
	}: OrderIntent) {
		const findUserService = makeFindUserService();

		const user = await findUserService.handle(userId);

		if (!user) throw new UserNotFound();

		const validateEstablishment = makeValidateEstablishmentFromOrderService();

		await validateEstablishment.handle({
			establishmentId,
			deliveryType,
			paymentMethod
		});

		const validateDeliveryService = makeValidateDeliveryFromOrderService();
		const validateProductService = makeValidateProductFromOrderService();
		const validateAddonsService = makeValidateAddonsFromOrderService();
		const calculateCouponDiscountService =
			makeCalculateCouponDiscountFromOrderService();

		const { address, coupon, district } = await validateDeliveryService.handle({
			deliveryType,
			establishmentId,
			userId,
			addressId,
			couponId,
			districtId
		});

		const itemsValidated: OrderItems[] = removeDuplicateItems(items);
		const orderItemsToProcess: OrderItemsToProcess[] = [];

		for (const item of itemsValidated) {
			const product = await validateProductService.handle({
				establishmentId,
				productId: item.id,
				productQuantity: item.quantity
			});

			const addons: OrderAddonsToProcess[] = await validateAddonsService.handle(
				{
					establishmentId,
					orderAddons: item.addonCategories
				}
			);

			const discount = getValueDiscounted(
				DiscountType.PERCENTAGE,
				product?.discount_percentage ?? 0,
				product.price
			);
			const price = transformPriceFromDatabase(product.price - discount);

			orderItemsToProcess.push({
				product: {
					...product,
					quantity: item.quantity,
					price
				},
				addons
			});
		}

		const { shippingCost, subtotal, couponDiscount } =
			calculateCouponDiscountService.handle({
				coupon,
				district,
				orderItemsToProcess
			});

		console.log(
			this.makeOrderMessage({
				address,
				coupon,
				couponDiscount,
				deliveryType,
				district,
				establishmentId,
				paymentMethod,
				shippingCost,
				subtotal,
				user,
				changeAmount,
				comment,
				orderItemsToProcess
			})
		);

		// await this.orderRepository.create(
		// 	this.buildOrderItems({
		// 		address,
		// 		coupon,
		// 		couponDiscount,
		// 		deliveryType,
		// 		district,
		// 		establishmentId,
		// 		paymentMethod,
		// 		shippingCost,
		// 		subtotal,
		// 		user,
		// 		changeAmount,
		// 		comment,
		// 		orderItemsToProcess
		// 	})
		// );

		const cache = makeCache();

		await cache.forgetKeysContaining(cache.keys.orders);
	}
}
