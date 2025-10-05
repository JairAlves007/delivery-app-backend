import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import type {
	OrderAddonsToProcess,
	OrderInfo,
	OrderIntent,
	OrderItems,
	OrderItemsToProcess
} from "@/types/order.ts";
import {
	AddonType,
	CouponType,
	DeliveryType,
	OrderStatusType,
	PaymentMethodType,
	type Coupon,
	type District,
	type Prisma
} from "@prisma/client";
import type { UserAddressWithDefault } from "@/types/address.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
import type { UserID, UserWithRole } from "@/types/user.ts";
import { makeFindAddonService } from "@/factories/services/addon/make-find-addon-service.ts";
import { AddonNotFound } from "@/errors/addon/not-found-error.ts";
import { makeValidateEstablishmentFromOrderService } from "@/factories/services/order/validations/make-validate-establishment-from-order-service.ts";
import { makeValidateCouponFromOrderService } from "@/factories/services/order/validations/make-validate-coupon-from-order-service.ts";
import { removeDuplicateItems } from "@/helpers/utils.ts";
import { makeValidateProductFromOrderService } from "@/factories/services/order/validations/make-validate-product-from-order-service.ts";
import { makeValidateAddonCategoriesFromOrderService } from "@/factories/services/order/validations/make-validate-addon-categories-from-order-service.ts";
import {
	getValueDiscountedByCoupon,
	transformPriceFromDatabase,
	transformValueToPercentageFromDatabase
} from "@/helpers/price.ts";
import { makeFindUserService } from "@/factories/services/user/make-find-user-service.ts";
import { UserNotFound } from "@/errors/user/user-not-found.ts";
import { makeFindAddressService } from "@/factories/services/address/make-find-address-service.ts";
import { makeFindDistrictService } from "@/factories/services/district/make-find-district-service.ts";
import { getStatusLabel } from "@/helpers/order.ts";

type ValidateOrderInfoParams = {
	establishmentId: EstablishmentID;
	userId: UserID;
	deliveryType: DeliveryType;
	couponId?: number | null;
	addressId?: string | null;
	districtId?: string | null;
};

type CalculateDiscountsParams = {
	coupon: Coupon | null;
	district: District | null;
	orderItemsToProcess: OrderItemsToProcess[];
};

type BuildOrderItemsParams = {
	user: UserWithRole;
	comment?: string | null;
	deliveryType: DeliveryType;
	paymentMethod: PaymentMethodType;
	establishmentId: EstablishmentID;
	changeAmount?: number | null;
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

		const {
			id: address_id,
			city,
			street,
			number,
			postal_code,
			state
		} = address;
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

	private async validateOrderInfos({
		deliveryType,
		establishmentId,
		userId,
		couponId,
		addressId,
		districtId
	}: ValidateOrderInfoParams): Promise<OrderInfo> {
		const orderInfos: OrderInfo = {
			coupon: null,
			address: null,
			district: null
		};

		if (!!couponId) {
			const validateCoupon = makeValidateCouponFromOrderService();

			orderInfos.coupon = await validateCoupon.handle({
				couponId: couponId,
				establishmentId,
				userId
			});
		}

		if (deliveryType == DeliveryType.DELIVERY) {
			const findAddressService = makeFindAddressService();
			const findDistrictService = makeFindDistrictService();

			const [address, district] = await Promise.all([
				addressId
					? findAddressService.handle({
							id: addressId,
							filterParams: { user_id: userId }
					  })
					: null,
				districtId
					? findDistrictService.handle({
							id: districtId,
							filterParams: { establishment_id: establishmentId }
					  })
					: null
			]);

			if (!!address) orderInfos.address = address;

			if (!!district) orderInfos.district = district;
		}

		return orderInfos;
	}

	private calculateDiscounts({
		coupon,
		district,
		orderItemsToProcess
	}: CalculateDiscountsParams) {
		let shippingCost = transformPriceFromDatabase(district?.shipping_cost ?? 0);
		let subtotal = orderItemsToProcess.reduce((acc, item) => {
			const addonsTotal = item.addons.reduce((acc, addon) => {
				return (acc += addon.price * addon.quantity);
			}, 0);

			return (acc += item.product.price * item.product.quantity + addonsTotal);
		}, 0);

		if (!!coupon && !!district) {
			const valueByType = {
				[CouponType.ORDER]: subtotal,
				[CouponType.SHIPPING]: shippingCost
			};

			const couponDiscount = getValueDiscountedByCoupon(
				coupon,
				valueByType[coupon.type]
			);

			switch (coupon.type) {
				case CouponType.ORDER:
					subtotal = couponDiscount;
					break;
				case CouponType.SHIPPING:
					shippingCost = couponDiscount;
					break;
			}
		}

		return {
			subtotal,
			shippingCost
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

		const { address, coupon, district } = await this.validateOrderInfos({
			deliveryType,
			establishmentId,
			userId,
			couponId,
			addressId,
			districtId
		});

		const itemsNonDuplicated: OrderItems[] = removeDuplicateItems(items);
		const orderItemsToProcess: OrderItemsToProcess[] = [];

		const validateProductService = makeValidateProductFromOrderService();
		const validateAddonCategoriesService =
			makeValidateAddonCategoriesFromOrderService();
		const findAddonService = makeFindAddonService();

		for (const item of itemsNonDuplicated) {
			const product = await validateProductService.handle({
				establishmentId,
				productId: item.id,
				productQuantity: item.quantity
			});

			const addons: OrderAddonsToProcess[] = [];

			if (!!item.addonCategories && item.addonCategories.length > 0) {
				const categoryAddonsNonDuplicated = removeDuplicateItems(
					item.addonCategories
				);

				for (const category of categoryAddonsNonDuplicated) {
					const { addonCategory, orderAddonsNonDuplicated } =
						await validateAddonCategoriesService.handle({
							establishmentId,
							categoryId: category.id,
							orderAddons: category.addons
						});

					for (const addon of orderAddonsNonDuplicated) {
						if (
							!addonCategory.addons.some(
								addonFromCategory => addonFromCategory.id === addon.id
							)
						)
							throw new AddonNotFound();

						const addonItem = await findAddonService.handle({ id: addon.id });

						addons.push({
							...addonItem,
							quantity:
								addonCategory.type === AddonType.MULTIPLE_CHOICE
									? 1
									: addon.quantity,
							price: transformPriceFromDatabase(addonItem.price)
						});
					}
				}
			}

			const discount = transformValueToPercentageFromDatabase(
				product?.discount_percentage ?? 0
			);
			const price = product.price * (1 - discount);

			orderItemsToProcess.push({
				product: {
					...product,
					quantity: item.quantity,
					price
				},
				addons
			});
		}

		const { shippingCost, subtotal } = this.calculateDiscounts({
			coupon,
			district,
			orderItemsToProcess
		});

		await this.orderRepository.create(
			this.buildOrderItems({
				address,
				coupon,
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
	}
}
