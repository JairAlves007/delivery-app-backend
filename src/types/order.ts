import type {
	Coupon,
	DeliveryType,
	District,
	OrderStatusType,
	PaymentMethodType,
	Prisma
} from "@prisma/client";
import type { EstablishmentID } from "./establishment.ts";
import type { UserID, UserWithRole } from "./user.ts";
import type { ProductFromRepository } from "./product.ts";
import type { AddonFromRepository } from "./addon.ts";
import type { UserAddressWithDefault } from "./address.ts";

export type OrderFromRepository = Prisma.OrderGetPayload<{
	include: {
		coupon: true;
		items: true;
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

export interface OrderPayload extends Omit<OrderFromRepository, "statuses"> {
	status: {
		label: string;
		value: OrderStatusType;
	};
}

export interface OrderAddonsToProcess extends AddonFromRepository {
	quantity: number;
}

export type BuildOrderItemsParams = {
	user: UserWithRole;
	comment?: string | null;
	contactPhone?: string | null;
	deliveryType: DeliveryType;
	paymentMethod: PaymentMethodType;
	establishmentId: EstablishmentID;
	changeAmount?: number | null;
	couponDiscount: number;
	coupon: Coupon | null;
	address: UserAddressWithDefault | null;
	district: District | null;
	shippingCost: number;
	subtotal: number;
	orderItemsToProcess: OrderItemsToProcess[];
};

export type OrderInfo = {
	coupon: Coupon | null;
	address: UserAddressWithDefault | null;
	district: District | null;
};

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
	userId: UserID;
	contactPhone?: string | null;
	addressId?: string | null;
	districtId?: string | null;
	couponId?: number | null;
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
	addon: string;
	coupon: string;
	changeAmount: string;
	comment: string;
	discount: string;
};
