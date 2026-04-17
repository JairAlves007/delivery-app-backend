import { UserNotFound } from "@/errors/user/user-not-found.js";
import { makeCalculateCouponDiscountFromOrderService } from "@/factories/services/order/validations/make-calculate-coupon-discount-from-order-service.js";
import { makeValidateAddonsFromOrderService } from "@/factories/services/order/validations/make-validate-addons-from-order-service.js";
import { makeValidateDeliveryFromOrderService } from "@/factories/services/order/validations/make-validate-delivery-from-order-service.js";
import { makeValidateEstablishmentFromOrderService } from "@/factories/services/order/validations/make-validate-establishment-from-order-service.js";
import { makeValidateProductFromOrderService } from "@/factories/services/order/validations/make-validate-product-from-order-service.js";
import { makeFindUserService } from "@/factories/services/user/make-find-user-service.js";
import {
	type Coupon,
	DiscountType,
	type District,
	OrderStatusType,
	type Prisma
} from "@/generated/prisma/client.js";
import { getStatusLabel } from "@/helpers/order.js";
import {
	getValueDiscounted,
	transformPriceFromDatabase
} from "@/helpers/price.js";
import { removeDuplicateItems } from "@/helpers/utils.js";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { sendOrderConfirmationMessageQueue } from "@/queues/mail-queue.js";
import type { UserAddressWithDefault } from "@/types/address.js";
import type {
	BuildOrderItemsParams,
	CreateOrderParams,
	OrderItems,
	OrderItemsToProcess
} from "@/types/order.js";

export class CreateOrderService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
	}

	private getOrderCouponInputData(
		coupon: Coupon | null
	): Partial<Prisma.OrderCreateInput> | undefined {
		if (!coupon) return undefined;

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
		if (!address || !district) return undefined;

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
		contactPhone,
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
			customer_name: user.name,
			customer_phone: address ? address.phone : (contactPhone ?? "S/N"),
			delivery_type: deliveryType,
			payment_method: paymentMethod,
			shipping_fee: shippingCost,
			change_amount: changeAmount,
			comment,
			subtotal,
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
				create: orderItemsToProcess.map(item => ({
					product_id: item.product.id,
					product_name: item.product.name,
					product_price: item.product.price,
					quantity: item.product.quantity,
					addons: {
						create: item.addons.map(addon => ({
							addon_id: addon.id,
							addon_name: addon.name,
							addon_price: addon.price,
							quantity: addon.quantity
						}))
					}
				}))
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

	async handle({ order, paramsToForget }: CreateOrderParams) {
		const {
			deliveryType,
			paymentMethod,
			changeAmount,
			couponId,
			addressId,
			establishmentId,
			districtId,
			userId,
			comment,
			contactPhone,
			items
		} = order;

		const findUserService = makeFindUserService();
		const validateEstablishment = makeValidateEstablishmentFromOrderService();
		const validateDeliveryService = makeValidateDeliveryFromOrderService();
		const validateProductService = makeValidateProductFromOrderService();
		const validateAddonsService = makeValidateAddonsFromOrderService();
		const calculateCouponDiscountService =
			makeCalculateCouponDiscountFromOrderService();

		const itemsValidated: OrderItems[] = removeDuplicateItems(items);

		const [user, , delivery] = await Promise.all([
			findUserService.handle(userId),
			validateEstablishment.handle({
				establishmentId,
				deliveryType,
				paymentMethod
			}),
			validateDeliveryService.handle({
				deliveryType,
				establishmentId,
				userId,
				addressId,
				couponId,
				districtId
			})
		]);

		if (!user) throw new UserNotFound();

		const { address, coupon, district } = delivery;

		const orderItemsToProcess: OrderItemsToProcess[] = await Promise.all(
			itemsValidated.map(async item => {
				const [product, addons] = await Promise.all([
					validateProductService.handle({
						establishmentId,
						productId: item.id,
						productQuantity: item.quantity
					}),
					validateAddonsService.handle({
						establishmentId,
						orderAddons: item.addonCategories
					})
				]);

				const discount = getValueDiscounted(
					DiscountType.PERCENTAGE,
					product.discount_percentage ?? 0,
					product.price
				);
				const price = transformPriceFromDatabase(product.price - discount);

				return {
					product: {
						...product,
						quantity: item.quantity,
						price
					},
					addons
				};
			})
		);

		const { shippingCost, subtotal, couponDiscount } =
			calculateCouponDiscountService.handle({
				coupon,
				district,
				orderItemsToProcess
			});

		const stockDecrements = orderItemsToProcess
			.filter(item => item.product.stock !== null)
			.map(item => ({
				productId: item.product.id,
				quantity: item.product.quantity
			}));

		await this.orderRepository.create(
			this.buildOrderItems({
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
				contactPhone,
				orderItemsToProcess
			}),
			{ stockDecrements }
		);

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "orders",
			paramsToForget
		});

		await sendOrderConfirmationMessageQueue({
			...order,
			user,
			address,
			coupon,
			couponDiscount,
			shippingCost,
			orderItemsToProcess,
			district,
			subtotal
		});
	}
}
