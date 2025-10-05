import type {
	Coupon,
	DeliveryType,
	District,
	PaymentMethodType,
	Prisma
} from "@prisma/client";
import type { EstablishmentID } from "./establishment.ts";
import type { UserID } from "./user.ts";
import type { ProductFromRepository } from "./product.ts";
import type { AddonFromRepository } from "./addon.ts";
import type { UserAddressWithDefault } from "./address.ts";

export type OrderFromRepository = Prisma.OrderGetPayload<{
	include: {
		coupon: true;
		items: true;
	};
}>;

export type OrderInfo = {
	coupon: Coupon | null;
	address: UserAddressWithDefault | null;
	district: District | null;
};

export interface OrderAddonsToProcess extends AddonFromRepository {
	quantity: number;
}

export type OrderItems = {
	id: string;
	quantity: number;
	addonCategories?: OrderCategoryAddons[] | null;
};

export type OrderItemsToProcess = {
	product: ProductFromRepository & {
		quantity: number;
	};
	addons: OrderAddonsToProcess[];
};

type OrderCategoryAddons = {
	id: number;
	addons: OrderAddons[];
};

export type OrderAddons = {
	id: number;
	quantity: number;
};

export type OrderIntent = {
	establishmentId: EstablishmentID;
	userId: UserID;
	addressId?: string | null;
	districtId?: string | null;
	couponId?: number | null;
	comment?: string | null;
	paymentMethod: PaymentMethodType;
	deliveryType: DeliveryType;
	changeAmount?: number | null;
	items: OrderItems[];
};
