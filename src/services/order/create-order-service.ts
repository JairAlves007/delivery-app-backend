import { makeSendOrderConfirmationMessageService } from "@/factories/services/order/make-send-order-confirmation-message.js";
import { makeCalculateCouponDiscountFromOrderService } from "@/factories/services/order/validations/make-calculate-coupon-discount-from-order-service.js";
import { makeValidateAddonsFromOrderService } from "@/factories/services/order/validations/make-validate-addons-from-order-service.js";
import { makeValidateDeliveryFromOrderService } from "@/factories/services/order/validations/make-validate-delivery-from-order-service.js";
import { makeValidateEstablishmentFromOrderService } from "@/factories/services/order/validations/make-validate-establishment-from-order-service.js";
import { makeValidateProductFromOrderService } from "@/factories/services/order/validations/make-validate-product-from-order-service.js";
import {
  type Coupon,
  DiscountType,
  type District,
  NotificationType,
  OrderStatusType,
  type Prisma,
  ProductPricingMode,
} from "@/generated/prisma/client.js";
import { getStatusLabel } from "@/helpers/order.js";
import { getValueDiscounted } from "@/helpers/price.js";
import { removeDuplicateItems } from "@/helpers/utils.js";
import type { IOrderRepository } from "@/interfaces/repositories/order-repository.js";
import prisma from "@/lib/prisma.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createNotificationQueue } from "@/queues/notification-queue.js";
import { buildOrderJobId } from "@/queues/order-queue.js";
import type {
  BuildOrderItemsParams,
  CreateOrderParams,
  CreateOrderPlan,
  GuestAddress,
  OrderItems,
  OrderItemsToProcess,
} from "@/types/order.js";

export class CreateOrderService {
  private orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  private getOrderCouponInputData(
    coupon: Coupon | null,
  ): Partial<Prisma.OrderCreateInput> | undefined {
    if (!coupon) return undefined;

    return {
      coupon: {
        connect: {
          id: coupon.id,
        },
      },
      orderCoupon: {
        create: {
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.value,
        },
      },
    };
  }

  private getOrderAddressDistrictInputData(
    address: GuestAddress | null,
    district: District | null,
  ): Partial<Prisma.OrderCreateInput> | undefined {
    if (!address || !district) return undefined;

    const { city, street, number, neighborhood, postalCode, state, complement, referencePoint } = address;
    const { id: district_id, name: district_name, shipping_cost } = district;

    return {
      orderDeliveryAddress: {
        create: {
          city,
          number,
          neighborhood,
          postal_code: postalCode,
          state,
          street,
          complement,
          reference_point: referencePoint,
          district_name,
          shipping_cost,
          district: {
            connect: {
              id: district_id,
            },
          },
        },
      },
    };
  }

  private buildOrderItems({
    customerName,
    customerPhone,
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
    idempotencyKey,
    orderItemsToProcess,
  }: BuildOrderItemsParams): Prisma.OrderCreateInput {
    const couponData = this.getOrderCouponInputData(coupon);
    const orderAddress = this.getOrderAddressDistrictInputData(
      address,
      district,
    );

    return {
      customer_name: customerName,
      customer_phone: customerPhone,
      delivery_type: deliveryType,
      payment_method: paymentMethod,
      shipping_fee: shippingCost,
      change_amount: changeAmount,
      comment,
      subtotal,
      idempotency_key: idempotencyKey,
      establishment: {
        connect: {
          id: establishmentId,
        },
      },
      items: {
        create: orderItemsToProcess.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_price: item.product.price,
          quantity: item.product.quantity,
          weight_grams: item.product.weight_grams ?? null,
          addons_subtotal: item.addonsSubtotalCents,
          addons: {
            create: item.addons.map((addon) => ({
              addon_id: addon.id,
              addon_name: addon.name,
              addon_price: addon.price,
              quantity: addon.quantity,
            })),
          },
        })),
      },
      statuses: {
        create: {
          label: getStatusLabel(OrderStatusType.PREPARING),
          value: OrderStatusType.PREPARING,
        },
      },
      ...orderAddress,
      ...couponData,
    };
  }

  async buildPlan({
    order,
    paramsToForget,
  }: CreateOrderParams): Promise<CreateOrderPlan> {
    const {
      deliveryType,
      paymentMethod,
      changeAmount,
      couponId,
      establishmentId,
      districtId,
      customerName,
      customerPhone,
      address: orderAddressInput,
      comment,
      items,
    } = order;

    const idempotencyKey = buildOrderJobId({ order, paramsToForget });

    const validateEstablishment = makeValidateEstablishmentFromOrderService();
    const validateDeliveryService = makeValidateDeliveryFromOrderService();
    const validateProductService = makeValidateProductFromOrderService();
    const validateAddonsService = makeValidateAddonsFromOrderService();
    const calculateCouponDiscountService =
      makeCalculateCouponDiscountFromOrderService();

    const itemsValidated: OrderItems[] = removeDuplicateItems(items);

    const [, delivery] = await Promise.all([
      validateEstablishment.handle({
        establishmentId,
        deliveryType,
        paymentMethod,
      }),
      validateDeliveryService.handle({
        deliveryType,
        establishmentId,
        customerName,
        customerPhone,
        couponId,
        districtId,
        address: orderAddressInput,
      }),
    ]);

    const { address, coupon, district } = delivery;

    const orderItemsToProcess: OrderItemsToProcess[] = await Promise.all(
      itemsValidated.map(async (item) => {
        const [product, addonsResult] = await Promise.all([
          validateProductService.handle({
            establishmentId,
            productId: item.id,
            productQuantity: item.quantity,
            weightGrams: item.weight_grams ?? null,
          }),
          validateAddonsService.handle({
            establishmentId,
            productId: item.id,
            orderAddons: item.addonCategories,
          }),
        ]);

        const discount = getValueDiscounted(
          DiscountType.PERCENTAGE,
          product.discount_percentage ?? 0,
          product.price,
        );
        const price = product.price - discount;

        return {
          product: {
            ...product,
            quantity: item.quantity,
            weight_grams: item.weight_grams ?? null,
            price,
          },
          addons: addonsResult.addons,
          addonsSubtotalCents: addonsResult.addonsSubtotalCents,
        };
      }),
    );

    const { shippingCost, subtotal, couponDiscount } =
      calculateCouponDiscountService.handle({
        coupon,
        district,
        orderItemsToProcess,
      });

    const stockDecrements = orderItemsToProcess
      .filter((item) => item.product.stock !== null)
      .map((item) => ({
        productId: item.product.id,
        quantity:
          item.product.pricing_mode === "PER_WEIGHT" &&
          item.product.weight_grams != null
            ? item.product.weight_grams
            : item.product.quantity,
        prevStock: item.product.stock as number,
        lowStockThreshold: item.product.low_stock_threshold,
        productName: item.product.name,
        pricingMode: item.product.pricing_mode,
      }));

    const orderInput = this.buildOrderItems({
      address,
      coupon,
      couponDiscount,
      deliveryType,
      district,
      establishmentId,
      paymentMethod,
      shippingCost,
      subtotal,
      customerName,
      customerPhone,
      changeAmount,
      comment,
      idempotencyKey,
      orderItemsToProcess,
    });

    return {
      idempotencyKey,
      orderInput,
      stockDecrements,
      paramsToForget,
      establishmentId,
      customerName,
      customerPhone,
      changeAmount,
      comment,
      deliveryType,
      paymentMethod,
      address,
      coupon,
      district,
      orderItemsToProcess,
    };
  }

  async persist(plan: CreateOrderPlan): Promise<void> {
    const alreadyProcessed =
      await this.orderRepository.existsByIdempotencyKey(plan.idempotencyKey);

    if (alreadyProcessed) return;

    const { id: orderId, lowStockProducts } = await this.orderRepository.create(
      plan.orderInput,
      { stockDecrements: plan.stockDecrements },
    );

    if (plan.coupon) {
      await prisma.userCoupon.create({
        data: { customer_phone: plan.customerPhone, coupon_id: plan.coupon.id },
      });
    }

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "orders",
      paramsToForget: plan.paramsToForget,
    });

    const sendConfirmationService = makeSendOrderConfirmationMessageService();
    await sendConfirmationService.handle({
      establishmentId: plan.establishmentId,
      address: plan.address,
      coupon: plan.coupon,
      deliveryType: plan.deliveryType,
      district: plan.district,
      paymentMethod: plan.paymentMethod,
      customerName: plan.customerName,
      customerPhone: plan.customerPhone,
      changeAmount: plan.changeAmount,
      comment: plan.comment,
      orderItemsToProcess: plan.orderItemsToProcess,
    });

    await createNotificationQueue({
      establishmentId: plan.establishmentId,
      type: NotificationType.ORDER_CREATED,
      title: "Novo pedido recebido",
      description: `Pedido de ${plan.customerName}`,
      metadata: {
        orderId,
        customerName: plan.customerName,
        customerPhone: plan.customerPhone,
      },
    });

    for (const product of lowStockProducts) {
      const stockLabel =
        product.pricingMode === ProductPricingMode.PER_WEIGHT
          ? `${product.stock}g`
          : `${product.stock}`;

      await createNotificationQueue({
        establishmentId: plan.establishmentId,
        type: NotificationType.LOW_STOCK,
        title: "Estoque baixo",
        description: `${product.name} com estoque baixo (${stockLabel} restantes)`,
        metadata: {
          productId: product.id,
          productName: product.name,
          stock: product.stock,
        },
      });
    }
  }
}
