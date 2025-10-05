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
	type Coupon,
	type District,
	type Prisma
} from "@prisma/client";
import type { UserAddressWithDefault } from "@/types/address.ts";
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

	async handle({
		deliveryType: delivery_type,
		paymentMethod: payment_method,
		changeAmount: change_amount,
		couponId: coupon_id,
		addressId: address_id,
		establishmentId: establishment_id,
		districtId: district_id,
		userId: user_id,
		...data
	}: OrderIntent) {
		const findUserService = makeFindUserService();

		const user = await findUserService.handle(user_id);

		if (!user) throw new UserNotFound();

		const validateEstablishment = makeValidateEstablishmentFromOrderService();

		await validateEstablishment.handle({
			establishmentId: establishment_id,
			deliveryType: delivery_type,
			paymentMethod: payment_method
		});

		const orderInfos: OrderInfo = {
			coupon: null,
			address: null,
			district: null
		};

		if (!!coupon_id) {
			const validateCoupon = makeValidateCouponFromOrderService();

			orderInfos.coupon = await validateCoupon.handle({
				couponId: coupon_id,
				establishmentId: establishment_id,
				userId: user_id
			});
		}

		if (delivery_type == DeliveryType.DELIVERY) {
			const findAddressService = makeFindAddressService();
			const findDistrictService = makeFindDistrictService();

			const [address, district] = await Promise.all([
				address_id
					? findAddressService.handle({
							id: address_id,
							filterParams: { user_id }
					  })
					: null,
				district_id
					? findDistrictService.handle({
							id: district_id,
							filterParams: { establishment_id }
					  })
					: null
			]);

			if (!!address) orderInfos.address = address;

			if (!!district) orderInfos.district = district;
		}

		const { address, coupon, district } = orderInfos;

		const itemsNonDuplicated: OrderItems[] = removeDuplicateItems(data.items);
		const orderItemsToProcess: OrderItemsToProcess[] = [];

		const validateProductService = makeValidateProductFromOrderService();
		const validateAddonCategoriesService =
			makeValidateAddonCategoriesFromOrderService();
		const findAddonService = makeFindAddonService();

		for (const item of itemsNonDuplicated) {
			const product = await validateProductService.handle({
				establishmentId: establishment_id,
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
							establishmentId: establishment_id,
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

		const couponData = this.getOrderCouponInputData(coupon);

		const orderAddress = this.getOrderAddressDistrictInputData(
			address,
			district
		);

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

		await this.orderRepository.create({
			...data,
			customer_name: user.name,
			delivery_type,
			payment_method,
			shipping_fee: shippingCost,
			subtotal,
			change_amount,
			establishment: {
				connect: {
					id: establishment_id
				}
			},
			user: {
				connect: {
					id: user_id
				}
			},
			items: {
				createMany: {
					data: [
						{
							product_id: orderItemsToProcess[0].product.id,
							quantity: orderItemsToProcess[0].product.quantity,
							product_name: orderItemsToProcess[0].product.name,
							product_price: orderItemsToProcess[0].product.price
						}
					]
				}
			},
			statuses: {
				create: {
					label: getStatusLabel(OrderStatusType.SHIPPED),
					value: OrderStatusType.SHIPPED
				}
			},
			...orderAddress,
			...couponData
		});
	}
}
