import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import type {
	OrderIntent,
	OrderItems,
	OrderItemsToProcess
} from "@/types/order.ts";
import { DeliveryType, PaymentMethodType } from "@prisma/client";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { isEstablishmentOpen } from "@/helpers/establishment.ts";
import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.ts";
import { EstablishmentIsClosed } from "@/errors/establishment/is-closed-error.ts";
import { EstablishmentDoesNotAcceptCardError } from "@/errors/establishment/does-not-accept-card-error.ts";
import { EstablishmentIsOnlyDeliveryError } from "@/errors/establishment/only-delivery-error.ts";
import { CouponNotFound } from "@/errors/coupon/not-found.ts";
import { makeCheckCouponService } from "@/factories/services/coupon/make-check-coupon-service.ts";
import { makeFindEstablishmentByIdService } from "@/factories/services/establishment/make-find-establishment-by-id-service.ts";
import { makeFindCouponService } from "@/factories/services/coupon/make-find-coupon-service.ts";
import { makeFindProductService } from "@/factories/services/product/make-find-product-service.ts";
import { ProductNotFound } from "@/errors/product/not-found-error.ts";
import { ProductOutOfStockError } from "@/errors/product/out-of-stock-error.ts";
import { makeFindAddonService } from "@/factories/services/addon/make-find-addon-service.ts";
import { AddonNotFound } from "@/errors/addon/not-found-error.ts";
import { AddonFromRepository } from "@/types/addon.ts";
import { AddonQuantityExceeded } from "@/errors/addon/quantity-exceeded-error.ts";

export class CreateOrderService {
	private orderRepository: IOrderRepository;

	constructor(orderRepository: IOrderRepository) {
		this.orderRepository = orderRepository;
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
		const cache = makeCache();
		const cacheKeys = {
			establishment: `${cache.keys.establishments}_${establishment_id}`,
			coupon: `${cache.keys.coupons}_${coupon_id}`
		};
		const findEstablishmentByIdService = makeFindEstablishmentByIdService();
		const establishment = await cache.rememberForever(
			cacheKeys.establishment,
			async () =>
				await findEstablishmentByIdService.handle({
					id: establishment_id
				})
		);

		if (!establishment) {
			await cache.forget(cacheKeys.establishment);
			throw new EstablishmentNotFound();
		}

		if (
			!establishment.accepts_credit_card &&
			payment_method === PaymentMethodType.CARD
		)
			throw new EstablishmentDoesNotAcceptCardError();

		if (establishment.only_delivery && delivery_type !== DeliveryType.DELIVERY)
			throw new EstablishmentIsOnlyDeliveryError();

		if (!isEstablishmentOpen(establishment)) throw new EstablishmentIsClosed();

		if (!!coupon_id) {
			const findCouponService = makeFindCouponService();
			const coupon = await cache.rememberForever(
				cacheKeys.coupon,
				async () => await findCouponService.handle({ id: coupon_id })
			);

			if (!coupon) {
				await cache.forget(cacheKeys.coupon);
				throw new CouponNotFound();
			}

			const checkCoupon = makeCheckCouponService();

			await checkCoupon.handle({
				code: coupon.code,
				establishmentId: establishment_id,
				userId: user_id
			});
		}

		const itemsNonDuplicated: OrderItems[] = [
			...new Map(data.items.map(item => [item.id, item])).values()
		];
		const orderItemsToProcess: OrderItemsToProcess[] = [];

		const findProductService = makeFindProductService();
		const findAddonService = makeFindAddonService();

		for (const item of itemsNonDuplicated) {
			const productKey = `${cache.keys.products}_${item.id}`;
			const product = await cache.rememberForever(
				productKey,
				async () => await findProductService.handle({ id: item.id })
			);

			if (!product) {
				await cache.forget(productKey);
				throw new ProductNotFound();
			}

			if (product.stock && product.stock < item.quantity)
				throw new ProductOutOfStockError();

			const addons: AddonFromRepository[] = [];

			if (!!item.addons && item.addons.length > 0) {
				const itemAddonsNonDuplicated = [
					...new Map(item.addons.map(addon => [addon.id, addon])).values()
				];

				for (const addon of itemAddonsNonDuplicated) {
					const addonKey = `${cache.keys.addons}_${addon.id}`;
					const addonItem = await cache.rememberForever(
						addonKey,
						async () => await findAddonService.handle({ id: addon.id })
					);

					if (!addonItem) {
						await cache.forget(addonKey);
						throw new AddonNotFound();
					}

					if (
						!!addonItem.category.max_quantity &&
						addon.quantity &&
						addon.quantity > addonItem.category.max_quantity
					)
						throw new AddonQuantityExceeded();

					addons.push(addonItem);
				}
			}

			orderItemsToProcess.push({
				product,
				quantity: item.quantity,
				observations: item.observations,
				addons
			});
		}

		// await this.orderRepository.create({});
	}
}
