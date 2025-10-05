import type { IOrderRepository } from "@/interfaces/repositories/order-repository.ts";
import type {
	OrderIntent,
	OrderItems,
	OrderItemsToProcess
} from "@/types/order.ts";
import type { AddonFromRepository } from "@/types/addon.ts";
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
import { AddonQuantityExceeded } from "@/errors/addon/quantity-exceeded-error.ts";
import { makeFindAddonCategoryService } from "@/factories/services/addon/category/make-find-addon-category-service.ts";
import { AddonCategoryNotFound } from "@/errors/addon/category/not-found-error.ts";

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

		if (!establishment) throw new EstablishmentNotFound();

		if (
			!establishment.accepts_credit_card &&
			payment_method === PaymentMethodType.CARD
		)
			throw new EstablishmentDoesNotAcceptCardError();

		if (establishment.only_delivery && delivery_type !== DeliveryType.DELIVERY)
			throw new EstablishmentIsOnlyDeliveryError();

		// if (!isEstablishmentOpen(establishment)) throw new EstablishmentIsClosed();

		if (!!coupon_id) {
			const findCouponService = makeFindCouponService();
			const coupon = await cache.rememberForever(
				cacheKeys.coupon,
				async () => await findCouponService.handle({ id: coupon_id })
			);

			if (!coupon) throw new CouponNotFound();

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
		const findAddonCategory = makeFindAddonCategoryService();
		const findAddonService = makeFindAddonService();

		for (const item of itemsNonDuplicated) {
			const productKey = `${cache.keys.products}_${item.id}`;
			const product = await cache.rememberForever(
				productKey,
				async () => await findProductService.handle({ id: item.id })
			);

			if (!product) throw new ProductNotFound();

			if (product.stock && product.stock < item.quantity)
				throw new ProductOutOfStockError();

			const addons: AddonFromRepository[] = [];

			if (!!item.addonCategories && item.addonCategories.length > 0) {
				const categoryAddonsNonDuplicated = [
					...new Map(
						item.addonCategories.map(category => [category.id, category])
					).values()
				];

				for (const category of categoryAddonsNonDuplicated) {
					const addonCategoryKey = `${cache.keys.addonCategories}_${category.id}`;
					const addonCategory = await cache.rememberForever(
						addonCategoryKey,
						async () => await findAddonCategory.handle({ id: category.id })
					);

					if (!addonCategory) throw new AddonCategoryNotFound();

					const addonsNonDuplicated = [
						...new Map(category.addons.map(addon => [addon.id, addon])).values()
					];

					if (!!addonCategory.max_quantity) {
						const quantity = addonsNonDuplicated.reduce((acc, addon) => {
							return (acc += addon.quantity);
						}, 0);

						if (quantity > addonCategory.max_quantity)
							throw new AddonQuantityExceeded();
					}

					for (const addon of addonsNonDuplicated) {
						if (
							!addonCategory.addons.some(
								addonFromCategory => addonFromCategory.id === addon.id
							)
						)
							throw new AddonNotFound();

						const addonKey = `${cache.keys.addons}_${addon.id}`;
						const addonItem = await cache.rememberForever(
							addonKey,
							async () => await findAddonService.handle({ id: addon.id })
						);

						addons.push(addonItem);
					}
				}
			}

			orderItemsToProcess.push({
				product,
				quantity: item.quantity,
				addons
			});
		}

		console.log(orderItemsToProcess);

		// await this.orderRepository.create({});
	}
}
