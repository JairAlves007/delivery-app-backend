import type {
	DeliveryType,
	OrderStatusType,
	PaymentMethodType
} from "@/generated/prisma/client.js";

export type DashboardGranularity = "day" | "week" | "month";

export type DashboardScopeType = "GLOBAL" | "ESTABLISHMENT";

export type DashboardServiceInput = {
	from?: Date;
	to?: Date;
	granularity: DashboardGranularity;
	establishmentId?: string;
	isAdmin: boolean;
};

export type DashboardRepositoryInput = {
	establishmentId?: string;
	from: Date;
	to: Date;
};

export type DashboardTopNInput = DashboardRepositoryInput & {
	limit: number;
};

export type DashboardOrdersOverTimeInput = DashboardRepositoryInput & {
	granularity: DashboardGranularity;
};

export type DashboardSummaryRow = {
	totalOrders: number;
	paidOrders: number;
	cancelledOrders: number;
	grossRevenue: number;
	discountsTotal: number;
	shippingTotal: number;
	netRevenue: number;
	averageOrderValue: number;
	distinctCustomers: number;
};

export type DashboardBucketRow = {
	bucket: string;
	orders: number;
	revenue: number;
};

export type DashboardStatusRow = {
	status: OrderStatusType;
	count: number;
	revenue: number;
};

export type DashboardPaymentMethodRow = {
	method: PaymentMethodType;
	count: number;
	revenue: number;
};

export type DashboardDeliveryTypeRow = {
	type: DeliveryType;
	count: number;
	revenue: number;
};

export type DashboardTopProductRow = {
	productId: string;
	name: string;
	unitsSold: number;
	revenue: number;
};

export type DashboardTopCategoryRow = {
	categoryId: string;
	name: string;
	unitsSold: number;
	revenue: number;
};

export type DashboardTopCustomerRow = {
	userId: string;
	name: string;
	orders: number;
	spent: number;
};

export type DashboardCouponUsageRow = {
	code: string;
	ordersWithCoupon: number;
	discountTotal: number;
};

export type DashboardTopEstablishmentRow = {
	establishmentId: string;
	name: string;
	orders: number;
	revenue: number;
};

export type DashboardResponse = {
	currency: "BRL";
	range: {
		from: string;
		to: string;
		granularity: DashboardGranularity;
		timezone: string;
	};
	scope: {
		type: DashboardScopeType;
		establishmentId: string | null;
	};
	summary: DashboardSummaryRow;
	ordersOverTime: DashboardBucketRow[];
	ordersByStatus: DashboardStatusRow[];
	ordersByPaymentMethod: DashboardPaymentMethodRow[];
	ordersByDeliveryType: DashboardDeliveryTypeRow[];
	topProducts: DashboardTopProductRow[];
	topCategories: DashboardTopCategoryRow[];
	topCustomers: DashboardTopCustomerRow[] | null;
	couponsUsage: DashboardCouponUsageRow[];
	topEstablishments: DashboardTopEstablishmentRow[] | null;
	establishmentsCount: number | null;
	usersCount: number | null;
};
