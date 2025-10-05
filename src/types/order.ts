import type { DeliveryType, PaymentMethodType, Prisma } from "@prisma/client";
import type { EstablishmentID } from "./establishment.ts";
import type { UserID } from "./user.ts";
import { ProductFromRepository } from "./product.ts";
import { AddonFromRepository } from "./addon.ts";

export type OrderFromRepository = Prisma.OrderGetPayload<{
	include: {
		coupon: true;
		items: true;
	};
}>;

export type OrderItems = {
	id: string;
	quantity: number;
	observations?: string | null;
	addons?: OrderAddons[] | null;
};

export type OrderItemsToProcess = Omit<OrderItems, "id" | "addons"> & {
	product: ProductFromRepository;
	addons: AddonFromRepository[];
};

type OrderAddons = {
	id: number;
	quantity: number | null;
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
