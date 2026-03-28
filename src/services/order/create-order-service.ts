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
	OrderAddonsToProcess,
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
			items
		} = order;
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
				orderItemsToProcess
			})
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
