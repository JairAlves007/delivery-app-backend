import type { z } from "zod";

import type {
  Coupon,
  DeliveryType,
  District,
  PaymentMethodType,
  Prisma,
} from "@/generated/prisma/client.js";
import type { orderPayloadSchema } from "@/schemas/response-schema.js";

import type { AddonFromRepository } from "./addon.js";
import type { ForgetAllListingCacheKeysParams } from "./cache.js";
import type { EstablishmentID } from "./establishment.js";
import type { ProductFromRepository } from "./product.js";

export type OrderFromRepository = Prisma.OrderGetPayload<{
  include: {
    coupon: true;
    items: { include: { addons: true } };
    orderCoupon: true;
    orderDeliveryAddress: true;
    statuses: {
      select: {
        label: true;
        value: true;
      };
      orderBy: {
        created_at: "desc";
      };
      take: 1;
    };
  };
}>;

export type OrderPayload = z.infer<typeof orderPayloadSchema>;

export interface OrderAddonsToProcess extends AddonFromRepository {
  quantity: number;
}

export type OrderAddressInput = {
  street: string;
  number?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  complement?: string | null;
  referencePoint?: string | null;
  phone: string;
};

export type GuestAddress = {
  customerName: string;
  street: string;
  number?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  complement?: string | null;
  referencePoint?: string | null;
  phone: string;
};

export type BuildOrderItemsParams = {
  customerName: string;
  customerPhone: string;
  comment?: string | null;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethodType;
  establishmentId: EstablishmentID;
  changeAmount?: number | null;
  couponDiscount: number;
  coupon: Coupon | null;
  address: GuestAddress | null;
  district: District | null;
  shippingCost: number;
  subtotal: number;
  orderItemsToProcess: OrderItemsToProcess[];
};

export type SendOrderConfirmationMessageParams = {
  customerName: string;
  customerPhone: string;
  comment?: string | null;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethodType;
  changeAmount?: number | null;
  coupon: Coupon | null;
  address: GuestAddress | null;
  district: District | null;
  orderItemsToProcess: OrderItemsToProcess[];
};

export type OrderInfo = {
  coupon: Coupon | null;
  address: GuestAddress | null;
  district: District | null;
};

export type OrderItems = {
  id: string;
  quantity: number;
  weight_grams?: number | null;
  addonCategories?: OrderCategoryAddons[] | null;
};

export type OrderItemsToProcess = {
  product: ProductFromRepository & {
    quantity: number;
    weight_grams?: number | null;
  };
  addons: OrderAddonsToProcess[];
  addonsSubtotalCents: number;
};

export type OrderCategoryAddons = {
  id: number;
  addons: OrderAddons[];
};

export type OrderAddons = {
  id: number;
  quantity: number;
};

export type OrderIntent = {
  establishmentId: EstablishmentID;
  customerName: string;
  customerPhone: string;
  address?: OrderAddressInput | null;
  districtId?: string | null;
  couponId?: string | null;
  comment?: string | null;
  paymentMethod: PaymentMethodType;
  deliveryType: DeliveryType;
  changeAmount?: number | null;
  items: OrderItems[];
};

export type OrderSubSectionMessage = {
  address: string;
  referencePoint: string;
  product: string;
  productUnit: string;
  productWeighted: string;
  addon: string;
  addonCategoryBlock: string;
  addonItemQuantity: string;
  addonItemMultiple: string;
  addonItemSingle: string;
  addonItemFractional: string;
  addonItemNone: string;
  coupon: string;
  changeAmount: string;
  comment: string;
  discountOrder: string;
  discountShipping: string;
};

export type CreateOrderParams = {
  order: OrderIntent;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;
