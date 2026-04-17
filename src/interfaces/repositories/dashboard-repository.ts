import type {
	DashboardBucketRow,
	DashboardCouponUsageRow,
	DashboardDeliveryTypeRow,
	DashboardOrdersOverTimeInput,
	DashboardPaymentMethodRow,
	DashboardRepositoryInput,
	DashboardStatusRow,
	DashboardSummaryRow,
	DashboardTopCategoryRow,
	DashboardTopCustomerRow,
	DashboardTopEstablishmentRow,
	DashboardTopNInput,
	DashboardTopProductRow
} from "@/types/dashboard.js";

export interface IDashboardRepository {
	getSummary(input: DashboardRepositoryInput): Promise<DashboardSummaryRow>;
	getOrdersOverTime(
		input: DashboardOrdersOverTimeInput
	): Promise<DashboardBucketRow[]>;
	getOrdersByStatus(
		input: DashboardRepositoryInput
	): Promise<DashboardStatusRow[]>;
	getOrdersByPaymentMethod(
		input: DashboardRepositoryInput
	): Promise<DashboardPaymentMethodRow[]>;
	getOrdersByDeliveryType(
		input: DashboardRepositoryInput
	): Promise<DashboardDeliveryTypeRow[]>;
	getTopProducts(input: DashboardTopNInput): Promise<DashboardTopProductRow[]>;
	getTopCategories(
		input: DashboardTopNInput
	): Promise<DashboardTopCategoryRow[]>;
	getTopCustomers(
		input: DashboardTopNInput & { establishmentId: string }
	): Promise<DashboardTopCustomerRow[]>;
	getCouponsUsage(
		input: DashboardTopNInput
	): Promise<DashboardCouponUsageRow[]>;
	getTopEstablishments(
		input: Omit<DashboardTopNInput, "establishmentId">
	): Promise<DashboardTopEstablishmentRow[]>;
	getEstablishmentsCount(): Promise<number>;
	getCustomersCount(): Promise<number>;
}
